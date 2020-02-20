'use strict';

var EventSource = require('eventsource');
const KubeGridResource = require('../KubeGridResource');
const KubeGridMethod = KubeGridResource.method;

module.exports = KubeGridResource.extend({
    path: 'builds',

    includeBasic: ['retrieve'],

    plan: KubeGridMethod({
        method: 'GET',
        path: '/{build}/plan'
    }),

    stream: function(id, onMessage, onError) {
        if (typeof onMessage !== 'function') {
            throw new Error(
                `KubeGrid: Argument "onMessage" must be a function but got: ${onMessage}`
            );
        }

        const url =
            this._kubegrid.getBaseUrl() +
            '/v1/builds/' +
            id +
            '/events?token=' +
            this._kubegrid.getApiField('authToken');

        var source = new EventSource(url);

        source.onerror = function(err) {
            onError(err);
        };
        source.addEventListener('event', function(event) {
            onMessage(event);
        });
        return source;
    }
});
