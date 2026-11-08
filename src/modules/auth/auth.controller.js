import * as authService from './auth.service.js';
import { catchAsync } from '../../utils/catchAsync.js';
import { AppError } from '../../errors/AppError.js';

export const register = catchAsync(async (req, res, next) => {
  const { email, password, fullName } = req.body;

  if (!email || !password || !fullName) {
    throw new AppError('Email, password, and fullName are required', 400);
  }

  const result = await authService.register({ email, password, fullName });

  res.status(201).json({
    status: 'success',
    data: result,
  });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Email and password are required', 400);
  }

  const result = await authService.login({ email, password });

  res.status(200).json({
    status: 'success',
    data: result,
  });
});
export const getMe = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user,
    },
  });
});