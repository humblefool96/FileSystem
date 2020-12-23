const http = require('http');
const app = require('./app');

const port = 9094;

const server = http.createServer(app);

server.listen(port);