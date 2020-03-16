const kgApiKey = process.env.KUBEGRID_API_KEY;

const kubegrid = require('../lib/kubegrid')(kgApiKey, {
    host: 'localhost',
    port: 90
});
kubegrid.setProtocol("http");

// kubegrid.cluster
//     .listApps(34)
//     .then(apps => {
//         console.log(apps);
//     })
//     .catch(err => {
//         console.error('error', err);
//     });

// kubegrid.cluster
//     .attachApp(34, {
//         app_ids: [3]
//     })
//     .then(apps => {
//         console.log(apps);
//     })
//     .catch(err => {
//         console.error('error', err);
//     });

// kubegrid.cluster
//     .deleteApp(34, 3)
//     .then(appTypes => {
//         console.log(appTypes);
//     })
//     .catch(err => {
//         console.error('error', err);
//     });


kubegrid.cluster
    .deployApp(34, 3)
    .then(app => {
        console.log(app);
    })
    .catch(err => {
        console.error('error', err);
    });