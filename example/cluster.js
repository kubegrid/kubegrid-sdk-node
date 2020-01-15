const kgApiKey = process.env.KUBEGRID_API_KEY;

const kubegrid = require('kubegrid-sdk-node')(kgApiKey);

const clusterID = 1

// Retrieve Cluster's kube.config File
kubegrid.cluster.getKubeConfig(clusterID).then(rawKubeConfig => {
    console.log(rawKubeConfig)
}).catch(err => {
    console.error(err)
})

// Retrieve Cluster's ssh File
kubegrid.cluster.getSshKey(clusterID).then(rawSshKey => {
    console.log(rawSshKey)
}).catch(err => {
    console.error(err)
})

// Retrieve Cluster's windows password
kubegrid.cluster.getWindowsPassword(clusterID).then(rawWindowsPw => {
    console.log(rawWindowsPw)
}).catch(err => {
    console.error(err)
})

// List Cluster's nodes
kubegrid.cluster.listNodes(clusterID).then(nodes => {
    console.log(nodes)
}).catch(err => {
    console.error(err)
})

// Add more nodes to cluster
kubegrid.cluster.addNodes(clusterID, {
    linux: 1,
    windows: 0
}).catch(err => {
    console.error(err)
})