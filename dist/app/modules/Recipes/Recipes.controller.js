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
exports.RecipeController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const Recipes_service_1 = require("./Recipes.service");
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const createRecipe = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const recipeData = req.body;
    // 🔹 Ensure `ingredientName` is an array
    if (typeof recipeData.ingredientName === 'string') {
        try {
            recipeData.ingredientName = JSON.parse(recipeData.ingredientName);
        }
        catch (error) {
            throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Invalid JSON format for ingredientName");
        }
    }
    if (!Array.isArray(recipeData.ingredientName)) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "ingredientName must be an array");
    }
    // calculate total time
    recipeData.totalTime = Number(recipeData.prepTime) + Number(recipeData.cookTime);
    const result = yield Recipes_service_1.RecipeService.createRecipeIntoDB(recipeData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Recipe created successfully',
        data: result,
    });
}));
// update recipe for 
const updateRecipe = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const recipeData = req.body;
    // Pass the files directly from the request to the service
    const updatedRecipe = yield Recipes_service_1.RecipeService.updateRecipeIntoDB(id, recipeData, req === null || req === void 0 ? void 0 : req.files);
    // Send the response with the updated recipe
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Recipe updated successfully',
        data: updatedRecipe,
    });
}));
// all recipes
const getAllRecipe = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const paginationOptions = {
        page: Number(req.query.page),
        limit: Number(req.query.limit),
        sortBy: req.query.sortBy,
        sortOrder: req.query.sortOrder || 'desc'
    };
    const result = yield Recipes_service_1.RecipeService.getAllRecipes(paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        Total: result.data.length,
        success: true,
        message: 'All Recipes retrieved successfully',
        data: result,
    });
}));
// single recipe
const getSingleRecipe = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield Recipes_service_1.RecipeService.getSingleRecipe(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Single Recipe retrieved successfully',
        data: result,
    });
}));
// delete recipe
const deleteRecipe = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield Recipes_service_1.RecipeService.deleteRecipeFromDB(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Recipe deleted successfully',
        data: result,
    });
}));
exports.RecipeController = {
    createRecipe,
    updateRecipe,
    getAllRecipe,
    getSingleRecipe,
    deleteRecipe,
};
