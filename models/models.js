import sequelize from '../db.js';
import {DataTypes} from 'sequelize';

export const User = sequelize.define('user', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  email: {type: DataTypes.STRING, unique: true},
  password: {type: DataTypes.STRING},
  firstName: {type: DataTypes.STRING, allowNull: false},
  lastName: {type: DataTypes.STRING, allowNull: false},
  image: {type: DataTypes.STRING, allowNull: false, defaultValue: ''},
  status: {type: DataTypes.STRING, allowNull: false, defaultValue: ''},
});

export const FollowingUser = sequelize.define('followingUser', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  userId: {type: DataTypes.INTEGER},
  followingUserId: {type: DataTypes.INTEGER},
});

export const Post = sequelize.define('post', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  image: {type: DataTypes.STRING, allowNull: true},
  text: {type: DataTypes.STRING, allowNull: false},
},{
  timestamps: true,
});

export const Like = sequelize.define('like', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  postId: {type: DataTypes.INTEGER, allowNull: false},
  userId: {type: DataTypes.INTEGER, allowNull: false},
},{
  createdAt: false,
  updatedAt: false
});

User.hasMany(FollowingUser);
FollowingUser.belongsTo(User);

User.hasMany(Post);
Post.belongsTo(User);

Post.hasMany(Like);
Like.belongsTo(Post);

export default {
  Post,
  User,
  Like,
  FollowingUser,
};
