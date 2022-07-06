import { Router as createRouter } from 'express';
import PingController from '../controllers/ping';
const router = createRouter();

router.get('/ping', async (_req, res) => {
  res.json(await PingController.getMessage());
});

export default router;
