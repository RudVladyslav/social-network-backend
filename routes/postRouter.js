import Router from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import PostController from '../controllers/PostController.js';

const postRouter = new Router();

postRouter.get('/', authMiddleware, PostController.getUserPosts)
postRouter.get('/single/:id', authMiddleware, PostController.getOnePost)
postRouter.get('/wall', authMiddleware, PostController.getPostsWall)
postRouter.post('/', authMiddleware, PostController.createPost);
postRouter.put('/:id', authMiddleware, PostController.updatePost);
postRouter.delete('/:id', authMiddleware, PostController.deletePost);
postRouter.post('/like/:id', authMiddleware, PostController.addLike);
postRouter.delete('/unlike/:id', authMiddleware, PostController.removeLike);


export default postRouter;
