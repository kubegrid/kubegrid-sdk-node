'use strict';

const KubeGridResource = require('../KubeGridResource');
const KubeGridMethod = KubeGridResource.method;

module.exports = KubeGridResource.extend({
    path: 'app-types',

    includeBasic: ['create', 'list', 'retrieve', 'update', 'delete']
});
