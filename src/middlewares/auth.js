import { verifyToken } from '../utils/jwt.js';
import * as userRepository from '../modules/users/user.repository.js';
import { AppError } from '../errors/AppError.js';
import { catchAsync } from '../utils/catchAsync.js';

export const protect = catchAsync(async (req, res, next) => {
  let token;

  // 1. Extract Bearer token from Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new AppError('You are not logged in. Please provide a token.', 401);
  }

  // 2. Verify token signature and expiration
  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (err) {
    throw new AppError('Invalid or expired token. Please log in again.', 401);
  }

  // 3. Verify user still exists in database
  const currentUser = await userRepository.findById(decoded.id);
  if (!currentUser) {
    throw new AppError('The user belonging to this token no longer exists.', 401);
  }

  // 4. Attach user record to request object for downstream controllers
  req.user = currentUser;
  next();
});