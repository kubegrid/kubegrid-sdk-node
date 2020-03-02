const kgApiKey = process.env.KUBEGRID_API_KEY;

const kubegrid = require('../lib/kubegrid')(kgApiKey, {
    host: 'api-viciniti.kubegrid.net'
});

kubegrid.selfManagedServer.delete(31).then(resp => {
    console.log(':::: RESPONSE::::', resp);
});
