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
exports.RecipeService = void 0;
const http_status_codes_1 = require("http-status-codes");
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const Recipes_model_1 = require("./Recipes.model");
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const createRecipeIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const recipes = yield Recipes_model_1.Recipe.create(payload);
    if (!recipes)
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to create recipe');
    return recipes;
});
const updateRecipeIntoDB = (id, payload, files) => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch the existing recipe from the database to preserve missing fields (e.g., images or video)
    const existingRecipe = yield Recipes_model_1.Recipe.findById(id);
    if (!existingRecipe)
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Recipe not found');
    // Handle image files (if any)
    const getFilePaths = (files) => {
        return files ? files.map((file) => file.path) : [];
    };
    // If no new images are uploaded, retain the old images
    const images = (files === null || files === void 0 ? void 0 : files["image"]) ? getFilePaths(files["image"]) : existingRecipe.image;
    // Handle video (if present), retain the old video if no new one is uploaded
    const video = (files === null || files === void 0 ? void 0 : files["video"]) ? files["video"][0].path : payload.video || existingRecipe.video;
    // Calculate total time
    const prepTime = payload.prepTime ? Number(payload.prepTime) : existingRecipe.prepTime;
    const cookTime = payload.cookTime ? Number(payload.cookTime) : existingRecipe.cookTime;
    // Prepare the updated payload
    const updatedPayload = Object.assign(Object.assign({}, payload), { prepTime,
        cookTime, image: images, video });
    const updatedRecipe = yield Recipes_model_1.Recipe.findByIdAndUpdate(id, updatedPayload, { new: true });
    if (!updatedRecipe)
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Recipe not found');
    return updatedRecipe;
});
// get all recipes
const getAllRecipes = (paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(paginationOptions);
    const recipes = yield Recipes_model_1.Recipe.find().sort({ [sortBy]: sortOrder }).skip(skip).limit(limit);
    const total = yield Recipes_model_1.Recipe.countDocuments();
    if (!recipes.length)
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Recipes not found');
    return {
        meta: {
            page,
            limit,
            total
        },
        data: recipes
    };
});
const getSingleRecipe = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const recipe = yield Recipes_model_1.Recipe.findById(id);
    if (!recipe)
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Recipe not found');
    return recipe;
});
// delete recipe
const deleteRecipeFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const recipe = yield Recipes_model_1.Recipe.findByIdAndDelete(id);
    if (!recipe)
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Recipe not found');
    return recipe;
});
exports.RecipeService = {
    createRecipeIntoDB,
    updateRecipeIntoDB,
    getAllRecipes,
    getSingleRecipe,
    deleteRecipeFromDB,
};
