import express from 'express';
import { UserRoutes } from '../modules/user/user.routes';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { RecipeRoutes } from '../modules/Recipes/Recipes.routes';
import { termsAndConditionRoutes } from '../modules/termsAndCondition/termsAndCondition.routes';
import { AdminRoutes } from '../modules/admin/admin.route';
import { RequestRecipeRoutes } from '../modules/R.Recipes/R.Recipes.routes';
import { CollectionRoutes } from '../modules/collection/collection.route';
import { RetingRoutes } from '../modules/reting/reting.route';
const router = express.Router();

const apiRoutes = [
    { path: "/user", route: UserRoutes },
    { path: "/users", route: AdminRoutes },
    { path: "/auth", route: AuthRoutes },
    { path: "/recipe", route: RecipeRoutes },
    { path: "/terms-and-conditions", route: termsAndConditionRoutes },
    { path: "/recipes", route: RequestRecipeRoutes },
    { path: "/collection", route: CollectionRoutes },
    { path: "/reting", route: RetingRoutes }
]

apiRoutes.forEach(route => router.use(route.path, route.route));
export default router;