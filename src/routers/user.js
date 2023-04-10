import express from 'express';
import { UserController } from '../controllers/index.js';
import { ValidateUser } from '../validators/index.js';

const router = express();

router.post('/add', ValidateUser.validateCreateUser, UserController.createUser);
router.get('/read', ValidateUser.validateReadUsers, UserController.getUser);
router.get(
  '/search',
  ValidateUser.validateSearchUsers,
  UserController.searchUsers
);
router.put(
  '/edit/:id',
  ValidateUser.validateUpdateUser,
  UserController.updateUser
);
router.delete('/edit/:id', UserController.removeUser);

export default router;
