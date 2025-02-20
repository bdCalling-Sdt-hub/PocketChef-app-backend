"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_routes_1 = require("../modules/user/user.routes");
const auth_routes_1 = require("../modules/auth/auth.routes");
const Recipes_routes_1 = require("../modules/Recipes/Recipes.routes");
const termsAndCondition_routes_1 = require("../modules/termsAndCondition/termsAndCondition.routes");
const admin_route_1 = require("../modules/admin/admin.route");
const R_Recipes_routes_1 = require("../modules/R.Recipes/R.Recipes.routes");
const router = express_1.default.Router();
const apiRoutes = [
    { path: "/user", route: user_routes_1.UserRoutes },
    { path: "/users", route: admin_route_1.AdminRoutes },
    { path: "/auth", route: auth_routes_1.AuthRoutes },
    { path: "/recipe", route: Recipes_routes_1.RecipeRoutes },
    { path: "/terms-and-conditions", route: termsAndCondition_routes_1.termsAndConditionRoutes },
    { path: "/recipes", route: R_Recipes_routes_1.RequestRecipeRoutes },
];
apiRoutes.forEach(route => router.use(route.path, route.route));
exports.default = router;
