import Router from 'express'
import authRouter from './authRouter.js';
import postRouter from './postRouter.js';
import usersRouter from './usersRouter.js';
import profileRouter from './pofileRouter.js';

const router = new Router()

router.use('/auth', authRouter)
router.use('/profile', profileRouter)
router.use('/posts', postRouter)
router.use('/users', usersRouter)

export default router
