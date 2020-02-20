const kgApiKey = process.env.KUBEGRID_API_KEY;

const kubegrid = require('../lib/kubegrid')(kgApiKey, {
    host: 'api-viciniti.kubegrid.net'
});

// kubegrid.build
//     .retrieve(146)
//     .then(build => {
//         console.log(build);
//     })
//     .catch(err => {
//         console.error(err);
//     });

// kubegrid.build
//     .plan(146)
//     .then(build => {
//         console.log(build);
//     })
//     .catch(err => {
//         console.error(err);
//     });

kubegrid.build.stream(146, function(event) {
    console.log('event', event);
});
