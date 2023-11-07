import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import checkRoutes from './routes.js';
config();

const app = express();

// Enable CORS
app.use(cors());

// Enable JSON use
app.use(express.json());

// Add needed routes
app.use(checkRoutes);

const PORT = process.env.PORT || 5000;
// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
})
