'use strict';

const KubeGridResource = require('../KubeGridResource');
const KubeGridMethod = KubeGridResource.method;

module.exports = KubeGridResource.extend({
    path: 'server-pools',

    includeBasic: ['create', 'retrieve', 'delete']
});
