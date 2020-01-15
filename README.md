# KubeGrid Node.js Library

[![Version](https://img.shields.io/npm/v/kubegrid-sdk-node.svg)](https://www.npmjs.org/package/kubegrid-sdk-node)
[![Build Status](https://travis-ci.org/kubegrid/kubegrid-sdk-node.svg?branch=master)](https://travis-ci.org/kubegrid/kubegrid-sdk-node)
[![Coverage Status](https://coveralls.io/repos/github/kubegrid/kubegrid-sdk-node/badge.svg)](https://coveralls.io/github/kubegrid/kubegrid-sdk-node)
[![Downloads](https://img.shields.io/npm/dm/kubegrid-sdk-node.svg)](https://www.npmjs.com/package/kubegrid-sdk-node)

The KubeGrid library provides access to the KubeGrid API from application written in Node.js

## Documentation

See the `kubegrid-sdk-node` API Docs for Node.js at https://api-docs.kubegrid.com/

## Installation

Install the package with:

```
npm install kubegrid-sdk-node --save
# or
yarn add kubegrid-sdk-node
```

## Usage

The package needs to be configured with your account's API Key which is available in your KubeGrid dashboard https://manager.kubegrid.com

```
const kgApiKey = process.env.KG_API_KEY;

const kubegrid = require('kubegrid-sdk-node')(kgApiKey);

kubegrid.cluster.list().then(clusters => {
    console.log(clusters)
}).catch(err => {
    console.error(err)
})
```

Or using ES module and `async` / `await`

```
import KubeGrid from 'kubegrid-sdk-node'

const kubegrid = require('kubegrid')(kgApiKey);

(async() => {
    const clusters = await kubegrid.cluster.list()

    console.log(clusters)
})();

```

## Development

Run all tests:

```
yarn install
yarn test
```

If you don't have `yarn` installed, get it with `npm install --global yarn`

## License

Updating...
