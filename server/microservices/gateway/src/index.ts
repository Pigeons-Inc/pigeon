import app from './app';
import * as dotenv from 'dotenv';
import path from 'path';
import cluster from 'cluster';
import os from 'os';
dotenv.config({ path: path.resolve(__dirname, '../.env') });
const port = process.env.PORT || 3000;

if (cluster.isPrimary) {
  for (let i = 0; i < os.cpus().length; i++) {
    cluster.fork();
  }
} else {
  console.log('Worker started: ' + process.pid);
  app.listen(port, () => {
    console.log(`API gateway is running at http://localhost:${port}`);
  });
}
