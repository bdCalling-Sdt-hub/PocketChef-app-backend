import { Router } from "express";
import { RequestRecipeController } from "./R.Recipes.controller";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";
import validateRequest from "../../middlewares/validateRequest";
import { RequestRecipeValidation } from "./R.Recipes.validation";

const route = Router();
// crete route
route.post("/create", auth(USER_ROLES.USER), validateRequest(RequestRecipeValidation.createRequestRecipeZodSchema), RequestRecipeController.createRequestRecipe)
// update route
route.patch("/:id", auth(USER_ROLES.USER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), validateRequest(RequestRecipeValidation.updateRequestRecipeZodSchema), RequestRecipeController.updateRequestRecipe)
// get all route
route.get("/", auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), RequestRecipeController.getAllRequestRecipe)
// get single route
route.get("/:id", auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), RequestRecipeController.getSingleRequestRecipe)
// get single recipe request by user id
route.get("/user/:userId", auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), RequestRecipeController.getSingleRecipeRequestByUserId)
// export route
export const RequestRecipeRoutes = route