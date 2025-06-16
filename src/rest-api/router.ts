import { Router } from 'express';
import * as userController from './controllers/userController';
import { userSchema, validateRequest } from './middlewares/validate';

const router = Router();

// User routes
router.get('/users', userController.getAllUsers);
router.post('/users', validateRequest(userSchema), userController.createUser);
router.get('/users/:id', userController.getUserById);

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

export default router;