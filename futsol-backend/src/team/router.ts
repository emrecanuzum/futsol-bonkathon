import { Router } from 'express';
import { authenticationMiddleware } from '../middleware/auth';
import { getTeam } from './get';
import { setPositionForPlayer } from './setPosition';

const teamRouter = Router();

teamRouter.get('/get', authenticationMiddleware, getTeam);
teamRouter.post('/set-position', authenticationMiddleware, setPositionForPlayer);

export default teamRouter;