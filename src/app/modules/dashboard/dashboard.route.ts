import express from 'express';
import { DashboardController } from './dashboard.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.get('/total-user', auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), DashboardController.totalUser);
router.get('/total-new-user', auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), DashboardController.totalNewUser);
router.get('/total-recipe', auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), DashboardController.totalRecipe);

// ! todo: it's not work after create recipe from admin panel than it's work
router.get('/recommendation-recipe', auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), DashboardController.totalRecommendationRecipe);

router.get('/recent-view-recipe', auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), DashboardController.RecentViewRecipe);

export const DashboardRoutes = router;
