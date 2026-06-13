import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectdb from './config/db.js';
import authRouters from './routes/authRoutes.js';
import groupRoutes from './routes/groupRoutes.js';
import expenseRoutes from './routes/expenseRouters.js'
import settlementRoutes from './routes/settlementRoutes.js'
import notificationRoutes from './routes/notificationRoutes.js'

dotenv.config();
connectdb();
const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:3000',
  'http://localhost:3001',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy: origin not allowed'));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use('/api/auth',authRouters);
app.use('/api/groups',groupRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/settlement', settlementRoutes);
app.use('/api/notifications',notificationRoutes);


const PORT =5000
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT} `);
});