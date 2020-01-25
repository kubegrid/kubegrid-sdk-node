const kubegrid = require('kubegrid-sdk-node')(kgApiKey, {
  host: 'localhost',
  port: 90,
  timeout: 10000
});

kubegrid.setProtocol('http');
kubegrid.setHost('api.kubegrid.com');
kubegrid.setPort(443);
kubegrid.setTimeout(5000);
kubegrid.setApiKey('xxx.xxx.xxx');