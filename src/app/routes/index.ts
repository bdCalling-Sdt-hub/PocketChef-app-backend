import express from 'express';
import { UserRoutes } from '../modules/user/user.routes';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { RecipeRoutes } from '../modules/Recipes/Recipes.routes';
import { termsAndConditionRoutes } from '../modules/termsAndCondition/termsAndCondition.routes';
import { AdminRoutes } from '../modules/admin/admin.route';
import { RequestRecipeRoutes } from '../modules/R.Recipes/R.Recipes.routes';
import { CollectionRoutes } from '../modules/collection/collection.route';
import { ratingRoutes } from '../modules/rating/rating.route';
import { CategoryRoutes } from '../modules/category/category.route';
import { SubcategoryRoutes } from '../modules/subcategory/subcategory.route';
import { InstructionsRoutes } from '../modules/instructions/instructions.route';
import { FaqRoutes } from '../modules/faq/faq.route';
import { AboutRoutes } from '../modules/about/about.route';
import { PrivacyandpolicyRoutes } from '../modules/privacyandpolicy/privacyandpolicy.route';
import { CaruselRoutes } from '../modules/carusel/carusel.route';
import { IngredientsRoutes } from '../modules/ingredients/ingredients.route';
import { RecommendedRoutes } from '../modules/recommended/recommended.route';
import { AddtogroceryRoutes } from '../modules/addtogrocery/addtogrocery.route';
import { FavoriteRoutes } from '../modules/favorite/favorite.route';
import { RecentfavoratesRoutes } from '../modules/recentfavorates/recentfavorates.route';
const router = express.Router();

const apiRoutes = [
    { path: "/user", route: UserRoutes },
    { path: "/users", route: AdminRoutes },
    { path: "/auth", route: AuthRoutes },
    { path: "/recipe", route: RecipeRoutes },
    { path: "/terms-and-conditions", route: termsAndConditionRoutes },
    { path: "/recipes", route: RequestRecipeRoutes },
    { path: "/collection", route: CollectionRoutes },
    { path: "/rating", route: ratingRoutes },
    { path: "/", route: CategoryRoutes },
    { path: "/subcategory", route: SubcategoryRoutes },
    { path: "/", route: InstructionsRoutes },
    {
        path: "/faq",
        route: FaqRoutes
    },
    {
        path: "/about",
        route: AboutRoutes
    },
    {
        path: "/privacy-and-policy",
        route: PrivacyandpolicyRoutes
    },
    {
        path: "/carusel",
        route: CaruselRoutes
    },
    {
        path: "/ingredients",
        route: IngredientsRoutes
    },
    {
        path: "/recommended",
        route: RecommendedRoutes
    },
    {
        path: "/addtogrocery",
        route: AddtogroceryRoutes
    },
    {
        path: "/favorite",
        route: FavoriteRoutes
    },
    {
        path: "/recentfavorites",
        route: RecentfavoratesRoutes
    }
]

apiRoutes.forEach(route => router.use(route.path, route.route));
export default router;