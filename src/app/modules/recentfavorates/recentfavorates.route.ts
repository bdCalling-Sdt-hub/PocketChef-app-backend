import express from 'express';
import { RecentfavoratesController } from './recentfavorates.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.post('/', auth(USER_ROLES.USER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), RecentfavoratesController.createRecentFavorites);

export const RecentfavoratesRoutes = router;
