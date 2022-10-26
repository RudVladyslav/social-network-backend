import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import sequelize from './db.js';
import router from './routes/index.js';
import path from 'path';
import {fileURLToPath} from 'url';
import {dirname} from 'path';
import fileUpload from 'express-fileupload';
import models from './models/models.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(fileUpload({}));
app.use(express.static(path.resolve(__dirname, 'static')));
app.use('/api', router);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync()

    app.listen(PORT, () => console.log(
        `Server has been started on port:${PORT} \n http://localhost:${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
