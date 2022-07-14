/**
 * @author Eugene Pashkovsky <pashkovskiy.eugen@gmail.com>
 */

const { workDir, microservices } = require('./microservices.config.json');
const { fork } = require('child_process');
const path = require('path');

for (const microservice of microservices) {
  fork(path.resolve(__dirname, workDir, microservice, './build'));
}
