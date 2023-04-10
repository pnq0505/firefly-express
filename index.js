import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import * as dotenv from 'dotenv';

import { UserRouter } from './src/routers/index.js';
import { UserController } from './src/controllers/index.js';
import { ValidateUser } from './src/validators/index.js';

dotenv.config();
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get(
  '/locate',
  ValidateUser.validateLocateUsers,
  UserController.locateUsers
);

app.use('/user', UserRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
