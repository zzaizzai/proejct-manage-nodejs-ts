// route.ts
import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.render('route/index', { name: 'Route Page', message: 'This is the route page' });
  });

export default router;