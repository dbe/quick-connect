import service from './service';

const server = require('jayson').server(service);

let port = process.env.PORT || 3001;
server.http().listen(port);

console.log(`JSONRPC server listening on port ${port}`);
