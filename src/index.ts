import express from 'express';
import { createServer } from 'http';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors'; 
import { initializeSocketIO } from './socketIO';
import appRoutes from './app/server';

dotenv.config();

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 5000;

// Enable CORS for all routes
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
  ], // Allow requests from this origin
  credentials: true, // Allow credentials (e.g., cookies, authorization headers)
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
}));

app.use(express.json());
app.use('/api', appRoutes);

initializeSocketIO(server);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log('Database connected'))
  .catch((err) => console.error('Database connection error:', err));

// Start the server
server.listen(
  { port: PORT, host: '0.0.0.0', backlog: 511 },
  () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
  }
);
