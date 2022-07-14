/**
 * @author Eugene Pashkovsky <pashkovskiy.eugen@gmail.com>
 */

import app from './app';
import * as dotenv from 'dotenv';
import path from 'path';
import cluster from 'cluster';
import os from 'os';
dotenv.config({ path: path.resolve(__dirname, '../.env') });
const port = process.env.PORT || 3000;

if (+process.version.split('.')[0] < 16)
  throw new Error('Node version >= 16.x is required');
if (cluster.isPrimary) {
  console.log(`API gateway is running at http://localhost:${port}`);
  console.log(`Starting gateway primary process: ${process.pid}`);
  for (let i = 0; i < os.cpus().length - 1; i++) {
    const worker = cluster.fork();
    worker.on('exit', () => {
      console.log('Worker exited: ' + worker.process.pid + '. Restarting...');
      cluster.fork();
    });
  }
} else {
  app.listen(port, () => {
    console.log('Gateway worker started: ' + process.pid);
  });
}
