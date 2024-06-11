import { Router } from 'express';
import { authenticationMiddleware } from '../middleware/auth';
import { getUser } from './get';
import { updateUser } from './update';

const userRouter = Router();

userRouter.get('/get', authenticationMiddleware, getUser);
userRouter.patch('/update', authenticationMiddleware, updateUser);

export default userRouter;