var jayson = require('jayson');

import service from './service';


const server = jayson.server(service);
server.http().listen(3001);
console.log("Listening on port 3001");
