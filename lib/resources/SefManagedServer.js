'use strict';

const KubeGridResource = require('../KubeGridResource');
const KubeGridMethod = KubeGridResource.method;

module.exports = KubeGridResource.extend({
    path: 'self-managed-servers',

    includeBasic: ['create', 'list', 'delete'],
});