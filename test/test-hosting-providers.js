var expect = require('chai').expect;

const kgApiKey = process.env.KG_TEST_API_KEY;

var kg = require('../lib/kubegrid')(kgApiKey);

var hostingProviders = []
var newHostingProvider = null

it('List all hosting providers', function (done) {
    kg.hostingProvider.list().then(res => {
        hostingProviders = hostingProviders.concat(res.data)
        expect(res.data).to.be.an('array')
        done();
    }).catch(err => {
        done(err);
    })
});

it('Create new hosting provider', function (done) {
    kg.hostingProvider
        .create({
            provider_name: 'aws',
            region: 'us-west-1',
            api_key: 'tada',
            api_secret: 'bravo'
        })
        .then(res => {
            newHostingProvider = res.data
            expect(res.data).to.be.an('object')
            done();
        })
        .catch(err => {
            done(err);
        });
});

it('Retrieve hosting provider by ID', function (done) {
    kg.hostingProvider
        .retrieve(newHostingProvider.id)
        .then(res => {
            expect(res.data.id).equals(newHostingProvider.id)
            done();
        })
        .catch(err => {
            done(err);
        });
});

it('Delete hosting provider by ID', function (done) {
    kg.hostingProvider
        .delete(newHostingProvider.id)
        .then(res => {
            expect(res).equals('')
            done();
        })
        .catch(err => {
            done(err);
        });
});