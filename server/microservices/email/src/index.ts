import app from './app';
import path from 'path';
import * as dotenv from 'dotenv';
import { Socket } from 'net';
import { Server } from 'http';
dotenv.config({ path: path.resolve(__dirname, '../.env') });
const port = process.env.PORT || 3002;

let connections: Socket[] = [];
const shutdown = (server: Server) => () => {
  server.close(() => {
    process.exit(0);
  });
  setTimeout(() => {
    console.error(
      'Could not close connections in time, forcefully shutting down'
    );
    process.exit(1);
  }, 10000);

  connections.forEach((curr) => curr.end());
  setTimeout(() => connections.forEach((curr) => curr.destroy()), 5000);
};

const server = app.listen(port, () => {
  console.log(`Email service is running at http://localhost:${port}`);
});

server.on('connection', (connection) => {
  connections.push(connection);
  connection.on(
    'close',
    () => (connections = connections.filter((curr) => curr !== connection))
  );
});

process.on('SIGTERM', shutdown(server));
process.on('SIGINT', shutdown(server));
