/**
 * @author Eugene Pashkovsky <pashkovskiy.eugen@gmail.com>
 */

const { workDir, microservices } = require('./microservices.config.json');
const { exec, execSync } = require('child_process');
const path = require('path');
const dev = process.argv[2] === '-d';

const execCallback = (err, _stdout, stderr) => {
  if (err) {
    console.error(err);
    return;
  }
  if (stderr) {
    console.error(stderr);
  }
};

for (const microservice of microservices) {
  if (dev) {
    const mPath = path.resolve(__dirname, workDir, microservice);
    exec('npm run build-watch --prefix ' + mPath, execCallback);
  } else {
    process.stdout.write(`Building ${microservice}...`);
    const mPath = path.resolve(__dirname, workDir, microservice);
    execSync(
      'npm ci --prefix ' + mPath + ' && npm run build --prefix ' + mPath,
      execCallback
    );
    process.stdout.write(`done\n`);
  }
}
