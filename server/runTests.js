const { workDir, microservices } = require('./microservices.config.json');
const { execSync } = require('child_process');
const path = require('path');

for (const microservice of microservices) {
  execSync(
    'npm run test --prefix ' + path.resolve(__dirname, workDir, microservice)
  );
}
