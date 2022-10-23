import {User} from '../models/models.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const generateJwtToken = (id, email) => jwt.sign({
  id: id,
  email: email,
}, process.env.SECRET_KEY, {expiresIn: '12h'});

class AuthController {
  async registration(req, res, next) {
    try {
      const {email, password, firstName, lastName} = req.body;

      if (!email || !password) {
        res.status(403).json({message: 'Некоректный email или пароль'});
      }

      const candidate = await User.findOne({where: {email}});
      if (candidate) {
        res.status(403).json({message: 'Такой пользователь уже существует'})
      }

      const hashPassword = await bcrypt.hash(password, 7);

      await User.create({
        email,
        password: hashPassword,
        firstName,
        lastName,
        image: '',
        status: '',
      });

      res.status(201).json({message: 'Регистрация успешна'});

    } catch (e) {
      res.status(500).json({message: 'Не удалось зарегистрироваться'});
    }
  }

  async authenticate(req, res, next) {
    try {
      const {email, password} = req.body;
      const user = await User.findOne({where: {email}});
      if (!user) {
        return res.status(400).json({message: 'Логин или пароль неверный'});
      }

      const comparePassword = await bcrypt.compareSync(password, user.password);

      if (!comparePassword) {
        return res.status(400).json({message: 'Логин или пароль неверный'});
      }

      const token = generateJwtToken(user.id, user.email);
      return res.json({token});

    } catch (e) {
      res.status(500).json({message: 'Не удалось авторизироваться'});
    }
  }


}

export default new AuthController();
