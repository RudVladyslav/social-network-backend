import Router from 'express';
import ProfileController from '../controllers/ProfileController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const profileRouter = new Router();

profileRouter.get('/', authMiddleware, ProfileController.getUserData);
profileRouter.patch('/', authMiddleware, ProfileController.updateUserData);

export default profileRouter;
