'use strict';

const KubeGridResource = require('../KubeGridResource');
const KubeGridMethod = KubeGridResource.method;

module.exports = KubeGridResource.extend({
    path: 'repository-profiles',

    includeBasic: ['create', 'list', 'delete'],

    getRepositories: KubeGridMethod({
        method: 'GET',
        path: '/{profile}/repositories'
    })
});