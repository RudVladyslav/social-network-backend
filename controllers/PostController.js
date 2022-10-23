import {FollowingUser, Like, Post, User} from '../models/models.js';
import saveImage from '../utils/saveImage.js';


class PostController {
  async createPost(req, res, next) {
    try {
      const {id} = req.user;
      const {text} = req.body;
      const fileName = saveImage(req);
      await Post.create({userId: id, image: fileName, text});
      const posts = await Post.findAll({
        where: {userId: id},
        order: [['updatedAt', 'DESC']],
      });

      const postsWall = await Promise.all(posts.map(async (post) => {
        const checkArr = JSON.parse(JSON.stringify(await post.getLikes())).
            map(like => like.userId);
        post.setDataValue('likesCount', checkArr.length);
        delete post.toJSON().likes;
        return post;
      }));

      return res.status(200).json(postsWall);
    } catch (e) {
      return res.status(500).json({message: e});
    }
  }

  async updatePost(req, res, next) {
    try {
      const {id} = req.user;
      const postId = req.params.id;
      const post = await Post.findByPk(postId);
      const {text} = req.body;
      const fileName = saveImage(req);
      post.text = text;
      post.image = fileName;
      await post.save();
      const posts = await Post.findAll(
          {where: {userId: id}, order: [['updatedAt', 'DESC']]});

      const postsWall = await Promise.all(posts.map(async (post) => {
        const checkArr = JSON.parse(JSON.stringify(await post.getLikes())).
            map(like => like.userId);
        post.setDataValue('likesCount', checkArr.length);
        delete post.toJSON().likes;
        return post;
      }));
      return res.status(200).json(postsWall);
    } catch (e) {
      return res.status(500).json({message: 'Error'});

    }
  }

  async deletePost(req, res, next) {
    try {
      const {id} = req.user;
      const postId = req.params.id;
      const post = await Post.findOne({where: {userId: id, id: postId}});
      await post.destroy();
      return res.status(200).json({success: true});
    } catch (e) {
      return res.status(500).json({message: 'Error'});
    }
  }

  async getUserPosts(req, res, next) {
    try {
      const {id} = req.user;

      const posts = await Post.findAll(
          {
            where: {userId: id},
            attributes: {
              exclude: ['userId'],
            },
            order: [['updatedAt', 'DESC']],
          });
      const postsWall = await Promise.all(posts.map(async (post) => {
        const checkArr = JSON.parse(JSON.stringify(await post.getLikes())).
            map(like => like.userId);
        post.setDataValue('likesCount', checkArr.length);
        delete post.toJSON().likes;
        return post;
      }));

      return res.status(200).json(postsWall);
    } catch (e) {
      return res.status(500).json({message: e});
    }
  }

  async getOnePost(req, res) {
    try {
      const {id} = req.params;
      const post = await Post.findOne({
        where: {id: id},
        attributes: ['text', 'image'],
      });
      res.status(200).json(post);
    } catch (e) {
      res.status(500).json({message: e});
    }
  }

  async getPostsWall(req, res) {
    try {
      const {id} = req.user;

      const following = await FollowingUser.findAll({
            raw: true,
            attributes: [['followingUserId', 'id']],
            where: {userId: id},
          },
      );

      const followingArr = following.map(el => el.id);

      const posts = (await Post.findAll({
            attributes: {
              exclude: ['userId'],
            },
            where: {userId: [...followingArr, id]},
            order: [['updatedAt', 'DESC']],
            include: [
              {
                model: User,
                attributes: ['firstName', 'lastName', 'image'],
              },
            ],
          },
      ));

      const postsWall = await Promise.all(posts.map(async (post) => {
        const checkArr = JSON.parse(JSON.stringify(await post.getLikes())).
            map(like => like.userId);
        if (checkArr.length === 0) {
          post.setDataValue('liked', false);
          post.setDataValue('likesCount', 0);
          return post;
        }
        post.setDataValue('liked', checkArr.includes(id));
        post.setDataValue('likesCount', checkArr.length);
        delete post.toJSON().likes;
        return post;
      }));

      res.status(200).json(postsWall);
    } catch (e) {
      res.status(401).json({error: e});
    }
  }

  async addLike(req, res) {
    try {
      const userId = req.user.id;
      const postId = req.params.id;
      const isBeenLike = await Like.findOne({
        where: {postId, userId},
      });
      if (isBeenLike) {
        return res.status(200).json({message: 'Вы уже лайкнули этот пост'});
      }
      await Like.create({userId, postId});
      return res.status(200).json({success: true});
    } catch (e) {
      res.status(401).json({error: e});
    }
  }

  async removeLike(req, res) {
    try {
      const postId = req.params.id;
      const userId = req.user.id;
      const like = await Like.findOne({
        where: {postId, userId},
      });
      if (!like) {
        res.status(200).json({message: 'Вы убрали лайк под этим постом'});
      }
      await like.destroy();
      res.status(200).json({success: true});
    } catch (e) {
      res.status(401).json({error: e});
    }
  }

}

export default new PostController();
