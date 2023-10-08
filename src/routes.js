import { Router } from 'express';

const checkRoutes = Router();

// Health check endpoint
checkRoutes.get('/healthcheck', (req, res) => {
  res.json({ date: new Date().toLocaleString(), status: 'working' });
})

export default checkRoutes;