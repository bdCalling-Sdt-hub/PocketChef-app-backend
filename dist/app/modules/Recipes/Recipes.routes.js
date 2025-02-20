"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecipeRoutes = void 0;
const express_1 = require("express");
const Recipes_controller_1 = require("./Recipes.controller");
const fileUploaderHandler_1 = __importDefault(require("../../middlewares/fileUploaderHandler"));
const getFilePath_1 = require("../../../shared/getFilePath");
const router = (0, express_1.Router)();
// create recipe route
router.post("/create", 
// validateRequest(RecipeValidation.createRecipeZodSchema),
(0, fileUploaderHandler_1.default)(), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = req.body;
        const image = (0, getFilePath_1.getMultipleFilesPath)(req.files, 'image');
        const video = (0, getFilePath_1.getSingleFilePath)(req.files, "video");
        req.body = Object.assign({ image,
            video }, payload);
        next();
    }
    catch (error) {
        console.log(error);
    }
}), Recipes_controller_1.RecipeController.createRecipe);
// update recipe route
router.patch("/update/:id", 
// validateRequest(RecipeValidation.updateRecipeZodSchema),
Recipes_controller_1.RecipeController.updateRecipe);
// all recipes route
router.get("/", Recipes_controller_1.RecipeController.getAllRecipe);
// single recipe route
router.get("/:id", Recipes_controller_1.RecipeController.getSingleRecipe);
// delete recipe route
router.delete("/:id", Recipes_controller_1.RecipeController.deleteRecipe);
exports.RecipeRoutes = router;
