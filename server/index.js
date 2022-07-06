const { fork } = require('child_process');
const path = require('path');

fork(path.resolve(__dirname, './microservices/gateway/build/index.js'));
fork(path.resolve(__dirname, './microservices/auth/build/index.js'));
