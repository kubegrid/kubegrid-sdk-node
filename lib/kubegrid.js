'use strict';

const EventEmitter = require('events').EventEmitter;
const resources = require('./resources');
const utils = require('./utils');

KubeGrid.DEFAULT_PROTOCOL = 'https';
KubeGrid.DEFAULT_HOST = 'api.kubegrid.com';
KubeGrid.DEFAULT_PORT = 443;
KubeGrid.DEFAULT_BASE_PATH = '/v1/';
KubeGrid.DEFAULT_API_VERSION = 'v1';

KubeGrid.DEFAULT_TIMEOUT = require('http').createServer().timeout;

KubeGrid.PACKAGE_VERSION = require('../package.json').version;

KubeGrid.USER_AGENT = {
    bindings_version: KubeGrid.PACKAGE_VERSION,
    lang: 'node',
    lang_version: process.version,
    platform: process.platform,
    publisher: 'KubeGrid',
    uname: null
};

KubeGrid.USER_AGENT_SERIALIZED = null;

KubeGrid.MAX_NETWORK_RETRY_DELAY_SEC = 2;
KubeGrid.INITIAL_NETWORK_RETRY_DELAY_SEC = 0.5;

const ALLOWED_CONFIG_PROPERTIES = [
    'apiVersion',
    'httpAgent',
    'timeout',
    'host',
    'port'
];

KubeGrid.KubeGridResources = require('./KubeGridResource');
KubeGrid.resources = resources;

function KubeGrid(key, config = {}) {
    if (!(this instanceof KubeGrid)) {
        return new KubeGrid(key, config);
    }

    const props = this._getPropsFromConfig(config);

    Object.defineProperty(this, '_emitter', {
        value: new EventEmitter(),
        enumerable: false,
        configurable: false,
        writable: false
    });

    this.on = this._emitter.on.bind(this._emitter);
    this.once = this._emitter.once.bind(this._emitter);
    this.off = this._emitter.removeListener.bind(this._emitter);

    this._api = {
        auth: null,
        protocol: props.protocol || KubeGrid.DEFAULT_PROTOCOL,
        host: props.host || KubeGrid.DEFAULT_HOST,
        port: props.port || KubeGrid.DEFAULT_PORT,
        basePath: KubeGrid.DEFAULT_BASE_PATH,
        version: props.apiVersion || KubeGrid.DEFAULT_API_VERSION,
        timeout: utils.validateInteger(
            'timeout',
            props.timeout,
            KubeGrid.DEFAULT_TIMEOUT
        ),
        agent: props.httpAgent || null,
        dev: false
    };

    this._prepResources();
    this.setApiKey(key);

    this.errors = require('./Error');

    this._prevRequestMetrics = [];
}

KubeGrid.errors = require('./Error');

KubeGrid.prototype = {
    setHost(host, port, protocol) {
        this._setApiField('host', host);
        if (port) {
            this.setPort(port);
        }
        if (protocol) {
            this.setProtocol(protocol);
        }
    },

    setProtocol(protocol) {
        this._setApiField('protocol', protocol.toLowerCase());
    },

    setPort(port) {
        this._setApiField('port', port);
    },

    setDevMode(dev) {
        this._setApiField('dev', dev);
    },

    getDevMode() {
        return this.getApiField('dev');
    },

    getBaseUrl() {
        return (
            this.getApiField('protocol') +
            '://' +
            this.getApiField('host') +
            ':' +
            this.getApiField('port')
        );
    },

    setApiVersion(version) {
        if (version) {
            this._setApiField('version', version);
        }
    },

    setApiKey(key) {
        if (key) {
            this._setApiField('authToken', key);
            this._setApiField('auth', `Bearer ${key}`);
        }
    },

    setTimeout(timeout) {
        this._setApiField(
            'timeout',
            timeout == null ? KubeGrid.DEFAULT_TIMEOUT : timeout
        );
    },

    setHttpAgent(agent) {
        this._setApiField('agent', agent);
    },

    _setApiField(key, value) {
        this._api[key] = value;
    },

    getApiField(key) {
        return this._api[key];
    },

    getConstant: c => {
        return KubeGrid[c];
    },

    _prepResources() {
        for (const name in resources) {
            this[utils.pascalToCamelCase(name)] = new resources[name](this);
        }
    },

    _getPropsFromConfig(config) {
        // If config is null or undefined, just bail early with no props
        if (!config) {
            return {};
        }

        // config can be an object or a string
        const isString = typeof config === 'string';
        const isObject = config === Object(config) && !Array.isArray(config);

        if (!isObject && !isString) {
            throw new Error('Config must either be an object or a string');
        }

        // If config is a string, we assume the old behavior of passing in a string representation of the api version
        if (isString) {
            return {
                apiVersion: config
            };
        }

        // If config is an object, we assume the new behavior and make sure it doesn't contain any unexpected values
        const values = Object.keys(config).filter(
            value => !ALLOWED_CONFIG_PROPERTIES.includes(value)
        );

        if (values.length > 0) {
            throw new Error(
                `Config object may only contain the following: ${ALLOWED_CONFIG_PROPERTIES.join(
                    ', '
                )}`
            );
        }

        return config;
    }
};

module.exports = KubeGrid;

module.exports.KubeGrid = KubeGrid;
