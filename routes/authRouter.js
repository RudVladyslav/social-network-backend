import Router from 'express';
import AuthController from '../controllers/AuthController.js';
import handleValidationErrors from '../middlewares/validationErrorMiddleware.js';
import {
  authenticateValidation,
  registerValidation,
} from '../middlewares/validationsMiddleware.js';

const authRouter = new Router();

authRouter.post('/registration', registerValidation, handleValidationErrors,
    AuthController.registration);
authRouter.post('/authenticate', authenticateValidation, handleValidationErrors,
    AuthController.authenticate);

export default authRouter;
