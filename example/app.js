const kgApiKey = process.env.KUBEGRID_API_KEY;
const awsApiKey = process.env.AWS_API_KEY;
const awsSecretKey = process.env.AWS_SECRET_KEY;
const awsRegion = 'us-west-1';

const kubegrid = require('kubegrid-sdk-node')(kgApiKey);

kubegrid.hostingProvider
    .create({
        provider_name: 'aws',
        region: awsRegion,
        api_key: awsApiKey,
        api_secret: awsSecretKey
    })
    .then(res => {
        console.log(typeof res);
        const newHostingProvider = res.data;
        console.log('Created new hosting provider successfully');

        console.log(newHostingProvider);

        // Create new cluster
        kubegrid.cluster
            .create({
                hosting_provider_id: newHostingProvider.id,
                kubernetes: {
                    cluster_name: 'Demo Cluster',
                    master_size: 'small',
                    master_storage: 30,
                    worker_size: 'micro',
                    worker_storage: 30,
                    worker_count: 0,
                    worker_size_windows: 'medium',
                    worker_storage_windows: 50,
                    worker_count_windows: 0,
                    use_web_ui: true,
                    k8s_version: 'v1.15.5',
                    untaint: true
                }
            })
            .then(res => {
                const newCluster = res.data;
                console.log('Created new cluster successfully');
                console.log(newCluster);

                // delete cluster
                kubegrid.cluster
                    .delete(newCluster.id)
                    .then(res => {
                        console.log('Deleted cluster successfully');
                    })
                    .catch(err => {
                        console.error(err);
                    });
            })
            .catch(err => {
                console.error(err);
            });
    })
    .catch(err => {
        console.error(err);
    });
