import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test basic routes first
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// Test a simple parameterized route
app.get('/api/test/:id', (req, res) => {
  res.json({ success: true, id: req.params.id });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Minimal test server running on port ${PORT}`);
});
