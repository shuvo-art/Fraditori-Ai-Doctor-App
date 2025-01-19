import express from 'express';
import { createServer } from 'http';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { initializeSocketIO } from './socketIO';
import appRoutes from './app/server';

dotenv.config();

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use('/api', appRoutes);

initializeSocketIO(server);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log('Database connected'))
  .catch((err) => console.error('Database connection error:', err));

// Start the server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
 