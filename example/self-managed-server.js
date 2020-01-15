const kgApiKey = process.env.KUBEGRID_API_KEY;

const kubegrid = require('kubegrid-sdk-node')(kgApiKey);

// Create new server pool
kubegrid.serverPool.create({
    name: "Demo Server Pool"
}).then(newServerPool => {
    console.log(newServerPool)
}).catch(err => {
    console.error(err)
})

// Add server to server pool
kubegrid.selfManagedServer.create({
    "public_ip": "200.0.0.1",
    "private_ip": "10.0.0.1",
    "os": "linux",
    "ssh_user": "core",
    "ssh_password": "password",
    "ssh_key": "-----BEGIN RSA PRIVATE KEY-----\nprivate-key\n-----END RSA PRIVATE KEY-----",
    "server_pool_id": 30
}).then(addedServer => {
    console.log(addedServer)
}).catch(err => {
    console.error(err)
})

// Add server to server pool with copied credentials
kubegrid.selfManagedServer.create({
    "server_pool_id": 30,
    "public_ip": "200.0.0.2",
    "private_ip": "10.0.0.2",
    "os": "linux",
    "copy_from": {
        "id": 48
    }
}).then(addedServer => {
    console.log(addedServer)
}).catch(err => {
    console.error(err)
})

// List servers in server pool
kubegrid.selfManagedServer.retrieve(serverPoolId).then(serverPool => {
    console.log(serverPool)
}).catch(err => {
    console.error(err)
})

// Remove server in server pool
kubegrid.selfManagedServer.delete(serverIdToBeRemoved)

// List all server pools
kubegrid.selfManagedServer.list().then(serverPools => {
    console.log(serverPools)
}).catch(err => {
    console.error(err)
})