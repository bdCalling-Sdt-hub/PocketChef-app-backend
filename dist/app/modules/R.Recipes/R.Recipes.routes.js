"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestRecipeRoutes = void 0;
const express_1 = require("express");
const R_Recipes_controller_1 = require("./R.Recipes.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const R_Recipes_validation_1 = require("./R.Recipes.validation");
const route = (0, express_1.Router)();
// crete route
route.post("/create", (0, auth_1.default)(user_1.USER_ROLES.USER), (0, validateRequest_1.default)(R_Recipes_validation_1.RequestRecipeValidation.createRequestRecipeZodSchema), R_Recipes_controller_1.RequestRecipeController.createRequestRecipe);
// update route
route.patch("/:id", (0, auth_1.default)(user_1.USER_ROLES.USER), (0, validateRequest_1.default)(R_Recipes_validation_1.RequestRecipeValidation.updateRequestRecipeZodSchema), R_Recipes_controller_1.RequestRecipeController.updateRequestRecipe);
// export route
exports.RequestRecipeRoutes = route;
