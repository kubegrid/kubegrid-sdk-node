'use strict';

const KubeGridResource = require('../KubeGridResource');
const KubeGridMethod = KubeGridResource.method;

module.exports = KubeGridResource.extend({
    path: 'hosting-providers',

    includeBasic: ['create', 'list', 'retrieve', 'delete'],
});