import Router from 'express';
import UserController from '../controllers/UserController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const usersRouter = new Router();

usersRouter.get('/:id', authMiddleware, UserController.getOneUser);
usersRouter.get('/', authMiddleware, UserController.getAllUsers);
usersRouter.post('/follow', authMiddleware, UserController.followOnUser);
usersRouter.delete('/unfollow/:id', authMiddleware, UserController.unfollowOnUser);

export default usersRouter;
