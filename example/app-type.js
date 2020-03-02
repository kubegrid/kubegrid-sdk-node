const kgApiKey = process.env.KUBEGRID_API_KEY;

const kubegrid = require('../lib/kubegrid')(kgApiKey, {
    host: 'localhost',
    port: 90
});
kubegrid.setProtocol('http');
kubegrid.setDevMode(true);

// Create new application type
kubegrid.appType
    .create({
        name: 'Wordpress',
        description: 'A simple Wordpress',
        base_image: 'richarvey/nginx-php-fpm',
        shell: 'sh',
        working_dir: '/var/www/html',
        commands: [],
        cmd: ['/start.sh'],
        entry_point: [],
        ports: [80]
    })
    .then(appType => {
        console.log(appType);
    })
    .catch(err => {
        console.error(err);
    });

// List all application types
kubegrid.appType
    .list()
    .then(appTypes => {
        console.log(appTypes);
    })
    .catch(err => {
        console.error(err);
    });

// kubegrid.appType.update(id, {...payload})
// kubegrid.appType.delete(id)
