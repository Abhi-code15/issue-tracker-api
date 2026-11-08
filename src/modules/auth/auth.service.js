import * as userRepository from '../users/user.repository.js';
import { hashPassword, comparePassword } from '../../utils/password.js';
import { generateToken } from '../../utils/jwt.js';
import { AppError } from '../../errors/AppError.js';

export const register = async ({ email, password, fullName }) => {
  // 1. Check if user already exists
  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    throw new AppError('Email is already registered', 409);
  }

  // 2. Hash password
  const passwordHash = await hashPassword(password);

  // 3. Persist user in DB
  const newUser = await userRepository.createUser({
    email,
    passwordHash,
    fullName,
  });

  // 4. Generate token
  const token = generateToken({ id: newUser.id, email: newUser.email });

  return { user: newUser, token };
};

export const login = async ({ email, password }) => {
  // 1. Fetch user by email
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  // 2. Verify password match
  const isMatch = await comparePassword(password, user.password_hash);
  if (!isMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  // 3. Generate token
  const token = generateToken({ id: user.id, email: user.email });

  // Exclude password_hash from return payload
  const { password_hash, ...safeUser } = user;

  return { user: safeUser, token };
};