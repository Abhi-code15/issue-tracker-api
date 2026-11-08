import express from 'express';
import authRoutes from './modules/auth/auth.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { AppError } from './errors/AppError.js';

const app = express();

// 1. Global Middleware: Parse incoming JSON payloads
app.use(express.json());

// 2. Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'API is running healthy' });
});

// 3. Feature API Routes
app.use('/api/v1/auth', authRoutes);

// 4. Unhandled route catcher (must come AFTER all registered routes)
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// 5. Centralized error handling middleware (must be the very last middleware)
app.use(errorHandler);

export default app;