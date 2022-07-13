import db from './repository/sequelize';
import app from './app';
import { Server } from 'http';
import { Socket } from 'net';
const port = process.env.PORT || 3001;

db.authenticate()
  .then(() => {
    console.log(
      'Connection to auth database has been established successfully.'
    );
    let connections: Socket[] = [];
    const shutdown = (server: Server) => () => {
      db.close().then(() => {
        server.close(() => {
          process.exit(0);
        });
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

    db.sync({ logging: false }).then(() => {
      const server = app.listen(port, () => {
        console.log(`Auth service is running at http://localhost:${port}`);
      });

      server.on('connection', (connection) => {
        connections.push(connection);
        connection.on(
          'close',
          () =>
            (connections = connections.filter((curr) => curr !== connection))
        );
      });

      process.on('SIGTERM', shutdown(server));
      process.on('SIGINT', shutdown(server));
    });
  })
  .catch((err) => {
    throw new Error('Unable to connect to the database: ' + err);
  });
