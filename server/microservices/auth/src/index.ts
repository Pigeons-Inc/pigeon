import appPromise from './app';

const port = process.env.PORT || 3001;

appPromise.then((app) => {
  app.listen(port, () => {
    console.log(`Auth service is running at http://localhost:${port}`);
  });
});
