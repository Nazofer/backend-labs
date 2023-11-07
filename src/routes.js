import { Router } from 'express';
import { getFormattedDate } from './utils/getFormattedDate.js';
import { getStatus } from './utils/getStatus.js';

const checkRoutes = Router();

// Health check endpoint
checkRoutes.get('/healthcheck', (req, res) => {
  res.json({ date: getFormattedDate(), status: getStatus() });
})

export default checkRoutes;