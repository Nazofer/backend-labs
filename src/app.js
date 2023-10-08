const express = require('express');
const cors = require('cors');
const { config } = require('dotenv');
config();

const app = express();

app.use(cors());

app.get('/healthcheck', (req, res) => {
  res.json({ date: new Date().toLocaleString(), status: 'working' });
})

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
})
