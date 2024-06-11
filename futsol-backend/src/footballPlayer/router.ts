import { Router } from 'express';
import { authenticationMiddleware } from '../middleware/auth';
import { getUserPlayers } from './get';

const footballPlayerRouter = Router();

footballPlayerRouter.get('/get', authenticationMiddleware, getUserPlayers);

export default footballPlayerRouter;