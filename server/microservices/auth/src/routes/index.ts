import { Router as createRouter } from 'express';
import swaggerUi from 'swagger-ui-express';
import activate from './activate';
import login from './login';
import logout from './logout';
import refresh from './refresh';
import register from './register';
import validate from './validate';
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

router.post('/register', register);
router.post('/login', login);
router.delete('/logout', logout);
router.post('/activate', activate);
router.get('/validate', validate);
router.get('/refresh', refresh);

export default router;
