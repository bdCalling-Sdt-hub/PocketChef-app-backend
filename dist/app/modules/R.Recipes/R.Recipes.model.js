"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestRecipe = void 0;
const mongoose_1 = require("mongoose");
const requestRecipes = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    RequestRecipeBody: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});
exports.RequestRecipe = (0, mongoose_1.model)("requestRecipes", requestRecipes);
