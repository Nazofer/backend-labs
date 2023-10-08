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

// Start server
app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
})
