const kgApiKey = process.env.KUBEGRID_API_KEY;

const kubegrid = require('../lib/kubegrid')(kgApiKey, {
  host: 'localhost',
  port: 90
});

kubegrid.setProtocol('http');

// Create new repository profile
kubegrid.repositoryProfile.create({
    type: "github", //github, gitlab, bitbucket
    username: "sedevops",
    token: "<your-git-api-token>",
    refresh_token: "<refresh-token-only-bitbucket>"
}).then(repositoryProfile => {
    console.log(repositoryProfile)
}).catch(err => {
    console.error(err)
})

// List all repository profiles
kubegrid.repositoryProfile.list().then(repositoryProfiles => {
    console.log(repositoryProfiles)
}).catch(err => {
    console.error(err)
})

// Get all repositories belongs to git profile
kubegrid.repositoryProfile.getRepositories(6).then(repositories => {
    console.log(repositories)
}).catch(err => {
    console.error(err)
})