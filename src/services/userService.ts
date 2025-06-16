import { prisma } from '../common/db';
import logger from '../common/logger';
import { ApiError } from '../common/errorHandler';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config';

const SALT_ROUNDS = 10;

export async function createsUser(email: string, password: string) {
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword
      }
    });
    return user;
  } catch (err) {
    logger.error('Failed to create user:', err);
    throw new ApiError(400, 'Email already exists');
  }
}

export async function authenticateUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    config.jwtSecret,
    { expiresIn: '1h' }
  );

  return token;
}

export async function getsUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      createdAt: true
    }
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return user;
}