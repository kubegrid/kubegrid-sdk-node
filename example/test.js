const kgApiKey = process.env.KUBEGRID_API_KEY;

const kubegrid = require('../lib/kubegrid')(kgApiKey, {
    host: 'localhost',
    port: 90
});
kubegrid.setProtocol("http");

kubegrid.appType
    .list()
    .then(appTypes => {
        console.log(appTypes);
    })
    .catch(err => {
        console.error('error', err);
    });
