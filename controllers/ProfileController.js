import {FollowingUser, User} from '../models/models.js';
import saveImage from '../utils/saveImage.js';

class ProfileController {
  async getUserData(req, res, next) {
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


      const userData = await User.findOne({
        attributes: {
          exclude: ['password', 'email'],
        },
        where: {id: id},
      });

      userData.setDataValue('followersCount', follower.length)
      userData.setDataValue('followingCount', following.length)

      return res.status(200).json(userData);

    } catch (e) {
      res.json({message: e});
    }
  }

  async updateUserData(req, res, next) {
    try {
      const {firstName, lastName, status} = req.body;
      const {id} = req.user;
      let fileName;
      try {
        fileName = saveImage(req);
      } catch (e) {
        console.log(e);
      }

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

      const user = await User.findOne({
        where: {id: id},
        attributes: {
          exclude: ['password', 'email'],
        },
        include: [FollowingUser]
      });

      user.setDataValue('followersCount', follower.length)
      user.setDataValue('followingCount', following.length)

      user.firstName = firstName;
      user.lastName = lastName;
      user.status = status;
      user.image = fileName;
      await user.save();
      return res.json(user);
    } catch (e) {
      return res.status(403).json({message: 'error'});
    }
  }
}

export default new ProfileController();
