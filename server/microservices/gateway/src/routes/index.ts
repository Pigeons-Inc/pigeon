import { Router as createRouter } from 'express';
import swaggerUi from 'swagger-ui-express';
import auth from './auth';
import ping from './ping';
const router = createRouter();

router.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: '/swagger.json',
    },
  })
);

router.get('/ping', ping);
router.all('/auth*', auth);

export default router;
