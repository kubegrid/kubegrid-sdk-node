const kgApiKey = process.env.KUBEGRID_API_KEY;

const kubegrid = require('kubegrid-sdk-node')(kgApiKey);

// Create new service from git repository
kubegrid.service.create({
    "repo_profile_id": 7,
    "branch": "master",
    "repo_url": "https://github.com/trinvh/nodejs-hello-world",
    "repo_name": "nodejs-hello-world",
    "repo_owner": "trinvh"
}).then(service => {
    console.log(service)
}).catch(err => {
    console.error(err)
})

// List all services
kubegrid.service.list().then(services => {
    console.log(services)
}).catch(err => {
    console.error(err)
})
