'use strict';

const kgMethod = require('./KubeGridMethod');

module.exports = {
    create: kgMethod({
        method: 'POST',
    }),

    list: kgMethod({
        method: 'GET',
        methodType: 'list',
    }),

    retrieve: kgMethod({
        method: 'GET',
        path: '/{id}',
    }),

    update: kgMethod({
        method: 'POST',
        path: '{id}',
    }),

    // Avoid 'delete' keyword in JS
    delete: kgMethod({
        method: 'DELETE',
        path: '{id}',
    }),
};