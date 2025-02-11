import express from 'express';
import { UserRoutes } from '../modules/user/user.routes';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { RecipeRoutes } from '../modules/Recipes/Recipes.routes';
import { termsAndConditionRoutes } from '../modules/termsAndCondition/termsAndCondition.routes';
const router = express.Router();

const apiRoutes = [
    { path: "/user", route: UserRoutes },
    { path: "/auth", route: AuthRoutes },
    { path: "/recipe", route: RecipeRoutes },
    { path: "/terms-and-conditions", route: termsAndConditionRoutes }
]

apiRoutes.forEach(route => router.use(route.path, route.route));
export default router;