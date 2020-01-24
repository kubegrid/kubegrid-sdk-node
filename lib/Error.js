'use strict';

const utils = require('./utils');

class KubeGridError extends Error {
    constructor(raw = {}) {
        super(raw.message);
        // This splat is here for back-compat and should be removed in the next major version.
        this.populate(...arguments);
        this.type = this.constructor.name;
    }

    /**
     * DEPRECATED
     * This will be inlined in the constructor in the future.
     */
    populate(raw) {
        this.raw = raw;
        if (!raw || typeof raw !== 'object') {
            return;
        }
        // console.log(raw);
        this.statusCode = raw.statusCode;
        this.message = raw.error ? raw.error.message : raw.message;
    }

    /**
     * Helper factory which takes raw stripe errors and outputs wrapping instances
     */
    static generate(rawKubeGridError) {
        if (true) {
            // hide stacktrace from API response
            delete rawKubeGridError.stacktrace;
        }
        if (rawKubeGridError.data || rawKubeGridError.message) {
            return new KubeGridAPIError(rawKubeGridError)
        }
        return new Error('Generic', 'Unknown Error');
    }

}

// Specific KubeGrid Error types:

/**
 * CardError is raised when a user enters a card that can't be charged for
 * some reason.
 */
class KubeGridCardError extends KubeGridError {}

/**
 * InvalidRequestError is raised when a request is initiated with invalid
 * parameters.
 */
class KubeGridInvalidRequestError extends KubeGridError {}

/**
 * APIError is a generic error that may be raised in cases where none of the
 * other named errors cover the problem. It could also be raised in the case
 * that a new error has been introduced in the API, but this version of the
 * Node.JS SDK doesn't know how to handle it.
 */
class KubeGridAPIError extends KubeGridError {}

/**
 * AuthenticationError is raised when invalid credentials are used to connect
 * to KubeGrid's servers.
 */
class KubeGridAuthenticationError extends KubeGridError {}

/**
 * PermissionError is raised in cases where access was attempted on a resource
 * that wasn't allowed.
 */
class KubeGridPermissionError extends KubeGridError {}

/**
 * RateLimitError is raised in cases where an account is putting too much load
 * on KubeGrid's API servers (usually by performing too many requests). Please
 * back off on request rate.
 */
class KubeGridRateLimitError extends KubeGridError {}

/**
 * KubeGridConnectionError is raised in the event that the SDK can't connect to
 * KubeGrid's servers. That can be for a variety of different reasons from a
 * downed network to a bad TLS certificate.
 */
class KubeGridConnectionError extends KubeGridError {}

/**
 * SignatureVerificationError is raised when the signature verification for a
 * webhook fails
 */
class KubeGridSignatureVerificationError extends KubeGridError {}

/**
 * IdempotencyError is raised in cases where an idempotency key was used
 * improperly.
 */
class KubeGridIdempotencyError extends KubeGridError {}

/**
 * InvalidGrantError is raised when a specified code doesn't exist, is
 * expired, has been used, or doesn't belong to you; a refresh token doesn't
 * exist, or doesn't belong to you; or if an API key's mode (live or test)
 * doesn't match the mode of a code or refresh token.
 */
class KubeGridInvalidGrantError extends KubeGridError {}

function _Error(raw) {
    this.populate(...arguments);
    this.stack = new Error(this.message).stack;
}
_Error.prototype = Object.create(Error.prototype);
_Error.prototype.type = 'GenericError';
_Error.prototype.populate = function (type, message) {
    this.type = type;
    this.message = message;
};
_Error.extend = utils.protoExtend;

/**
 * DEPRECATED.
 * Do not use the default export; it may be removed or change in a future version.
 */
module.exports = _Error;

module.exports.KubeGridError = KubeGridError;
module.exports.KubeGridError = KubeGridError;
module.exports.KubeGridCardError = KubeGridCardError;
module.exports.KubeGridInvalidRequestError = KubeGridInvalidRequestError;
module.exports.KubeGridAPIError = KubeGridAPIError;
module.exports.KubeGridAuthenticationError = KubeGridAuthenticationError;
module.exports.KubeGridPermissionError = KubeGridPermissionError;
module.exports.KubeGridRateLimitError = KubeGridRateLimitError;
module.exports.KubeGridConnectionError = KubeGridConnectionError;
module.exports.KubeGridSignatureVerificationError = KubeGridSignatureVerificationError;
module.exports.KubeGridIdempotencyError = KubeGridIdempotencyError;
module.exports.KubeGridInvalidGrantError = KubeGridInvalidGrantError;