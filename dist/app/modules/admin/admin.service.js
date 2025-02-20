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
exports.AdminService = void 0;
const http_status_codes_1 = require("http-status-codes");
const user_model_1 = require("../user/user.model");
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const createAdminToDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const createAdmin = yield user_model_1.User.create(payload);
    if (!createAdmin) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to create Admin');
    }
    if (createAdmin) {
        yield user_model_1.User.findByIdAndUpdate({ _id: createAdmin === null || createAdmin === void 0 ? void 0 : createAdmin._id }, { verified: true }, { new: true });
    }
    return createAdmin;
});
const deleteAdminFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistAdmin = yield user_model_1.User.findByIdAndDelete(id);
    if (!isExistAdmin) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to delete Admin');
    }
    return;
});
const getAdminFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const admins = yield user_model_1.User.find({ role: 'ADMIN' })
        .select('name email profile contact location');
    return admins;
});
const getAllNewUser = (filter) => __awaiter(void 0, void 0, void 0, function* () {
    let startDate;
    const now = new Date();
    if (filter === 'weekly') {
        startDate = new Date();
        startDate.setDate(now.getDate() - 7);
    }
    else if (filter === 'monthly') {
        startDate = new Date();
        startDate.setMonth(now.getMonth() - 1);
    }
    else if (filter === 'yearly') {
        startDate = new Date();
        startDate.setFullYear(now.getFullYear() - 1);
    }
    else {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid filter type');
    }
    const users = yield user_model_1.User.find({ createdAt: { $gte: startDate } });
    if (users.length === 0) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'No new user found');
    }
    return users;
});
const getActiveUsers = (period) => __awaiter(void 0, void 0, void 0, function* () {
    let startDate;
    const now = new Date();
    if (period === 'daily') {
        startDate = new Date();
        startDate.setDate(now.getDate() - 1);
    }
    else if (period === 'weekly') {
        startDate = new Date();
        startDate.setDate(now.getDate() - 7);
    }
    else if (period === 'monthly') {
        startDate = new Date();
        startDate.setMonth(now.getMonth() - 1);
    }
    else if (period === 'yearly') {
        startDate = new Date();
        startDate.setFullYear(now.getFullYear() - 1);
    }
    else {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid period type');
    }
    const users = yield user_model_1.User.find({ lastLogin: { $gte: startDate } });
    return {
        period,
        count: users.length,
        users
    };
});
// user ban service single user 
const banUserFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistUser = yield user_model_1.User.findByIdAndUpdate(id, { userBan: true }, { new: true });
    if (!isExistUser) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to ban user');
    }
    return isExistUser;
});
exports.AdminService = {
    createAdminToDB,
    deleteAdminFromDB,
    getAdminFromDB,
    getAllNewUser,
    getActiveUsers,
    banUserFromDB
};
