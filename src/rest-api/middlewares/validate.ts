import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../../common/errorHandler';
import logger from '../../common/logger';

export function validateRequest(schema: any) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error } = schema.validate(req.body);
      if (error) {
        throw new ApiError(400, error.details[0].message);
      }
      next();
    } catch (err) {
      logger.error('Validation error:', err);
      next(err);
    }
  };
}

export const userSchema = {
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required()
};