'use strict';

const http = require('http');
const https = require('https');
const path = require('path');
const request = require('request');
const utils = require('./utils');
const Error = require('./Error');

const defaultHttpAgent = new http.Agent({
    keepAlive: true
});
const defaultHttpsAgent = new https.Agent({
    keepAlive: true
});

// Provide extension mechanism for KubeGrid Resource Sub-Classes
KubeGridResource.extend = utils.protoExtend;

// Expose method-creator & prepared (basic) methods
KubeGridResource.method = require('./KubeGridMethod');
KubeGridResource.BASIC_METHODS = require('./KubeGridMethod.basic');

/**
 * Encapsulates request logic for a KubeGrid Resource
 */
function KubeGridResource(kubegrid) {
    this._kubegrid = kubegrid;

    this.basePath = utils.makeURLInterpolator(
        this.basePath || kubegrid.getApiField('basePath')
    );
    this.resourcePath = this.path;
    this.path = utils.makeURLInterpolator(this.path);

    if (this.includeBasic) {
        this.includeBasic.forEach(function(methodName) {
            this[methodName] = KubeGridResource.BASIC_METHODS[methodName];
        }, this);
    }

    this.initialize(...arguments);
}

KubeGridResource.prototype = {
    path: '',

    // Methods that don't use the API's default '/v1' path can override it with this setting.
    basePath: null,

    initialize() {},

    // Function to override the default data processor. This allows full control
    // over how a KubeGridResource's request data will get converted into an HTTP
    // body. This is useful for non-standard HTTP requests. The function should
    // take method name, data, and headers as arguments.
    requestDataProcessor: null,

    // Function to add a validation checks before sending the request, errors should
    // be thrown, and they will be passed to the callback/promise.
    validateRequest: null,

    createFullPath(commandPath, urlData) {
        return path
            .join(
                this.basePath(urlData),
                this.path(urlData),
                typeof commandPath == 'function'
                    ? commandPath(urlData)
                    : commandPath
            )
            .replace(/\\/g, '/'); // ugly workaround for Windows
    },

    // Creates a relative resource path with symbols left in (unlike
    // createFullPath which takes some data to replace them with). For example it
    // might produce: /invoices/{id}
    createResourcePathWithSymbols(pathWithSymbols) {
        return `/${path
            .join(this.resourcePath, pathWithSymbols || '')
            .replace(/\\/g, '/')}`; // ugly workaround for Windows
    },

    // DEPRECATED: Here for backcompat in case users relied on this.
    wrapTimeout: utils.callbackifyPromiseWithTimeout,

    _timeoutHandler(timeout, req, callback) {
        return () => {
            const timeoutErr = new TypeError('ETIMEDOUT');
            timeoutErr.code = 'ETIMEDOUT';

            req._isAborted = true;
            req.abort();

            callback.call(
                this,
                new Error.KubeGridConnectionError({
                    message: `Request aborted due to timeout being reached (${timeout}ms)`,
                    detail: timeoutErr
                }),
                null
            );
        };
    },

    _responseHandler(req, callback) {
        return res => {
            let response = '';

            res.setEncoding('utf8');
            res.on('data', chunk => {
                response += chunk;
            });
            res.once('end', () => {
                if (this._kubegrid.getDevMode()) {
                    console.log('DEBUG: true | BEGIN RESPONSE --------');
                    console.log(response);
                    console.log('DEBUG: true | END RESPONSE ----------');
                }
                const headers = res.headers || {};
                // NOTE: KubeGrid responds with lowercase header names/keys.

                const requestEndTime = Date.now();
                const requestDurationMs = requestEndTime - req._requestStart;

                const responseEvent = utils.removeNullish({
                    method: req._requestEvent.method,
                    path: req._requestEvent.path,
                    status: res.statusCode,
                    elapsed: requestDurationMs,
                    request_start_time: req._requestStart,
                    request_end_time: requestEndTime
                });

                this._kubegrid._emitter.emit('response', responseEvent);

                if (response !== '' && res.statusCode >= 300) {
                    try {
                        response = JSON.parse(response);
                        if (response.error) {
                            response.statusCode = res.statusCode;
                            let err;
                            // Convert OAuth error responses into a standard format
                            // so that the rest of the error logic can be shared
                            if (typeof response.data === 'string') {
                                response.error = {
                                    type: response,
                                    message: response.data
                                };
                            }

                            if (res.statusCode === 401) {
                                err = new Error.KubeGridAuthenticationError(
                                    response
                                );
                            } else if (res.statusCode === 403) {
                                err = new Error.KubeGridPermissionError(
                                    response
                                );
                            } else if (res.statusCode === 429) {
                                err = new Error.KubeGridRateLimitError(
                                    response
                                );
                            } else {
                                err = Error.KubeGridError.generate(response);
                            }
                            return callback.call(this, err, null);
                        }
                    } catch (e) {
                        return callback.call(
                            this,
                            new Error.KubeGridAPIError({
                                message:
                                    'Invalid JSON received from the KubeGrid API',
                                response,
                                exception: e
                            }),
                            null
                        );
                    }

                    // Expose res object
                    // Object.defineProperty(response, 'lastResponse', {
                    //   enumerable: false,
                    //   writable: false,
                    //   value: res
                    // });
                }
                // parse response as object
                if (typeof response !== 'object') {
                    try {
                        response = JSON.parse(response);
                    } catch (e) {}
                }
                callback.call(this, null, response);
            });
        };
    },

    _generateConnectionErrorMessage(requestRetries) {
        return `An error occurred with our connection to KubeGrid.`;
    },

    _errorHandler(req, callback) {
        return error => {
            if (req._isAborted) {
                // already handled
                return;
            }
            callback.call(
                this,
                new Error.KubeGridConnectionError({
                    message: this._generateConnectionErrorMessage(),
                    detail: error
                }),
                null
            );
        };
    },

    _makeHeaders(
        auth,
        contentLength,
        clientUserAgent,
        method,
        userSuppliedHeaders,
        userSuppliedSettings
    ) {
        const defaultHeaders = {
            // Use specified auth token or use default from this kubegrid instance:
            Authorization: auth
                ? `Bearer ${auth}`
                : this._kubegrid.getApiField('auth'),
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Content-Length': contentLength,
            'User-Agent': this._getUserAgentString()
        };

        return Object.assign(utils.removeNullish(defaultHeaders));
    },

    _getUserAgentString() {
        const packageVersion = this._kubegrid.getConstant('PACKAGE_VERSION');
        const appInfo = this._kubegrid._appInfo
            ? this._kubegrid.getAppInfoAsString()
            : '';

        return `KubeGrid/v1 NodeBindings/${packageVersion} ${appInfo}`.trim();
    },

    _request(method, host, path, data, auth, options = {}, callback) {
        let requestData;
        const makeRequest = headers => {
            // timeout can be set on a per-request basis. Favor that over the global setting
            const timeout =
                options.settings &&
                Number.isInteger(options.settings.timeout) &&
                options.settings.timeout >= 0
                    ? options.settings.timeout
                    : this._kubegrid.getApiField('timeout');

            const isInsecureConnection =
                this._kubegrid.getApiField('protocol') == 'http';
            let agent = this._kubegrid.getApiField('agent');
            if (agent == null) {
                agent = isInsecureConnection
                    ? defaultHttpAgent
                    : defaultHttpsAgent;
            }
            let req = (isInsecureConnection ? http : https).request({
                host: host || this._kubegrid.getApiField('host'),
                port: this._kubegrid.getApiField('port'),
                path,
                method,
                agent,
                headers,
                ciphers: 'DEFAULT:!aNULL:!eNULL:!LOW:!EXPORT:!SSLv2:!MD5'
            });

            const requestStartTime = Date.now();

            const requestEvent = utils.removeNullish({
                method,
                path,
                request_start_time: requestStartTime
            });

            req._requestEvent = requestEvent;

            req._requestStart = requestStartTime;

            this._kubegrid._emitter.emit('request', requestEvent);

            req.setTimeout(
                timeout,
                this._timeoutHandler(timeout, req, callback)
            );

            req.once('response', res => {
                return this._responseHandler(req, callback)(res);
            });

            req.on('error', error => {
                return this._errorHandler(req, callback)(error);
            });

            req.once('socket', socket => {
                if (socket.connecting) {
                    socket.once(
                        isInsecureConnection ? 'connect' : 'secureConnect',
                        () => {
                            // Send payload; we're safe:
                            req.write(requestData);
                            req.end();
                        }
                    );
                } else {
                    // we're already connected
                    req.write(requestData);
                    req.end();
                }
            });
        };

        const prepareAndMakeRequest = (error, data) => {
            if (error) {
                return callback(error);
            }

            requestData = data;

            const headers = this._makeHeaders(
                auth,
                requestData.length,
                method,
                options.headers,
                options.settings
            );

            makeRequest(headers);
        };

        if (this.requestDataProcessor) {
            this.requestDataProcessor(
                method,
                data,
                options.headers,
                prepareAndMakeRequest
            );
        } else {
            prepareAndMakeRequest(null, JSON.stringify(data || {}));
        }
    }
};

module.exports = KubeGridResource;
