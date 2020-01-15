var expect = require('chai').expect;

const kgApiKey = process.env.KG_TEST_API_KEY;

var kg = require('../lib/kubegrid')(kgApiKey);

var clusters = []
var newCluster = null

it('List all clusters', function (done) {
    kg.cluster.list().then(res => {
        clusters = clusters.concat(res.data)
        expect(res.data).to.be.an('array')
        done();
    }).catch(err => {
        done(err);
    })
});

it('Create new cluster', function (done) {
    kg.cluster
        .create({
            "hosting_provider_id": 1,
            "kubernetes": {
                "cluster_name": "my-cluster-name",
                "master_size": "small",
                "master_storage": 30,
                "worker_size": "micro",
                "worker_storage": 30,
                "worker_count": 2,
                "worker_size_windows": "medium",
                "worker_storage_windows": 50,
                "worker_count_windows": 0,
                "use_web_ui": true,
                "k8s_version": "v1.15.5",
                "untaint": true
            }
        })
        .then(res => {
            newCluster = res.data
            expect(res.data).to.be.an('object')
            done();
        })
        .catch(err => {
            done(err);
        });
});

it('Retrieve cluster by ID', function (done) {
    kg.cluster
        .retrieve(newCluster.id)
        .then(res => {
            expect(res.data.id).equals(newCluster.id)
            done();
        })
        .catch(err => {
            done(err);
        });
});

it('Delete cluster by ID', function (done) {
    kg.cluster
        .delete(newCluster.id)
        .then(res => {
            expect(res).equals('')
            done();
        })
        .catch(err => {
            done(err);
        });
});