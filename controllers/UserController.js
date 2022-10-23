import {FollowingUser, Post, User} from '../models/models.js';
import {Op} from 'sequelize';

class UserController {
  async getOneUser(req, res, next) {
    try {
      const userId = req.user;
      const {id} = req.params;

      const followingUser = (await FollowingUser.findAll({
            raw: true,
            attributes: [['followingUserId', 'id']],
            where: {userId: id},
          })).map(el => el.id);

      const followersUser = (await FollowingUser.findAll({
        raw: true,
        attributes: [['userId', 'id']],
        where: {followingUserId: id},
      })).map(el => el.id);


      const user = await User.findOne({
        attributes: {
          exclude: ['password', 'email'],
        },
        where: {id: id}
      });
      const posts = await Post.findAll({where: {userId: id}, order: [['updatedAt', 'DESC']]})

      const following = await FollowingUser.findOne({where: {userId: userId.id, followingUserId: id}});

      if (following) {
        user.setDataValue('following', true);
      } else {
        user.setDataValue('following', false);
      }

      user.setDataValue('followersCount', followersUser.length)
      user.setDataValue('followingCount', followingUser.length)

      return res.status(200).json({user, posts});
    } catch (e) {
      return res.status(401).json({error: e});
    }
  }

  async getAllUsers(req, res, next) {
    try {
      const {id} = req.user;

      const following = (await FollowingUser.findAll({
            raw: true,
            attributes: [['followingUserId', 'id']],
            where: {userId: id},
          },
      )).map(el => el.id);

      const follower = (await FollowingUser.findAll({
        raw: true,
        attributes: [['userId', 'id']],
        where: {followingUserId: id},
      })).map(el => el.id);

      const users = (await User.findAll({
        raw: true,
        attributes: {
          exclude: ['password', 'email'],
        },
        where: {
          [Op.not]: [{id: id}],
        },
      })).map(user => {
        user.following = following.includes(user.id);
        user.follower = follower.includes(user.id);
        return user;
      });

      return res.status(200).json(users);
    } catch (e) {
      return res.status(500);
    }
  }

  async followOnUser(req, res, next) {
    try {
      const followingUserId = req.body.id;
      const {id} = req.user;
      if (id === Number(followingUserId)) {
        return res.json('Вы не можете подписаться на себя)');
      }

      const isFollowingUserBeen = await User.findByPk(followingUserId);
      if (!isFollowingUserBeen) {
        return res.json(
            'Вы не можете подписаться на этого пользователя, так как его не существует');
      }

      const isFollowingUser = await FollowingUser.findOne({
        where: {
          userId: id,
          followingUserId: followingUserId,
        },
      });
      if (isFollowingUser) {
        return res.json('Вы уже подписаны на этого пользователя');
      }

      await FollowingUser.create(
          {userId: id, followingUserId: followingUserId});
      return res.status(200).json({success: true});
    } catch (e) {
      res.status(500).json({Error: e});
    }
  }

  async unfollowOnUser(req, res, next) {
    try {
      const unfollowingUserId = req.params.id;
      const {id} = req.user;

      if (id === Number(unfollowingUserId)) {
        return res.json('Вы не можете отписаться от себя)');
      }

      const isUnfollowingUserBeen = await User.findByPk(unfollowingUserId);

      if (!isUnfollowingUserBeen) {
        return res.json(
            'Вы не можете подписаться на этого пользователя, так как его не существует');
      }

      const isUnfollowingUser = await FollowingUser.findOne({
        where: {
          userId: id,
          followingUserId: unfollowingUserId,
        },
      });
      if (!isUnfollowingUser) {
        return res.json('Вы уже отписаны от этого пользователя');
      }

      await isUnfollowingUser.destroy();

      return res.status(200).json({success: true});
    } catch (e) {
      res.status(500).json('Error: ', e);
    }
  }
}

export default new UserController();
