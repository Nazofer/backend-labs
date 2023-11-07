import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { UserController } from './users/users.controller.js';
import { users } from './db/users.db.js';
import { CategoriesController } from './categories/categories.controller.js';
import { categories } from './db/categories.db.js';
import { RecordsController } from './records/records.controller.js';
import { records } from './db/records.db.js';
import checkRoutes from './routes.js';

config();

const app = express();

// Enable CORS
app.use(cors());

// Enable JSON use
app.use(express.json());

// Add needed routes
const useRoutes = (app) => {
  app.use('/users', new UserController(users).router());
  app.use('/categories', new CategoriesController(categories).router());
  app.use('/records', new RecordsController(records).router());
  app.use('/', checkRoutes)
}

const PORT = process.env.PORT || 5000;
useRoutes(app);
// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
})
