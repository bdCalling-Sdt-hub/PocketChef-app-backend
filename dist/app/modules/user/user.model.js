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
exports.User = void 0;
const mongoose_1 = require("mongoose");
const user_1 = require("../../../enums/user");
const bcrypt_1 = __importDefault(require("bcrypt"));
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const http_status_codes_1 = require("http-status-codes");
const config_1 = __importDefault(require("../../../config"));
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: false,
    },
    appId: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        enum: Object.values(user_1.USER_ROLES),
        // required: true,
    },
    email: {
        type: String,
        required: false,
        unique: true,
        lowercase: true,
    },
    contact: {
        type: String,
        required: false,
    },
    password: {
        type: String,
        required: false,
        select: 0,
        minlength: 8,
    },
    location: {
        type: String,
        required: false,
    },
    profile: {
        type: String,
        default: 'https://res.cloudinary.com/dzo4husae/image/upload/v1733459922/zfyfbvwgfgshmahyvfyk.png',
    },
    verified: {
        type: Boolean,
        default: false,
    },
    userBan: {
        type: Boolean,
        default: false,
    },
    authentication: {
        type: {
            isResetPassword: {
                type: Boolean,
                default: false,
            },
            oneTimeCode: {
                type: Number,
                default: null,
            },
            expireAt: {
                type: Date,
                default: null,
            },
        },
        select: 0
    },
    accountInformation: {
        status: {
            type: Boolean,
            default: false,
        },
        stripeAccountId: {
            type: String,
        },
        externalAccountId: {
            type: String,
        },
        currency: {
            type: String,
        }
    }
}, {
    timestamps: true
});
//exist user check
userSchema.statics.isExistUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield exports.User.findById(id);
    return isExist;
});
userSchema.statics.isExistUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield exports.User.findOne({ email });
    return isExist;
});
//account check
userSchema.statics.isAccountCreated = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield exports.User.findById(id);
    return isUserExist.accountInformation.status;
});
//is match password
userSchema.statics.isMatchPassword = (password, hashPassword) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.compare(password, hashPassword);
});
//check user
// userSchema.pre('save', async function (next) {
//     //check user
//     const isExist = await User.findOne({ email: this.email });
//     if (isExist) {
//         throw new ApiError(StatusCodes.BAD_REQUEST, 'Email already exist!');
//     }
//     //password hash
//     this.password = await bcrypt.hash(this.password, Number(config.bcrypt_salt_rounds));
//     next();
// });
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isNew || this.isModified('email')) {
            const existingUser = yield exports.User.findOne({ email: this.email });
            if (existingUser) {
                throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Email already exists!');
            }
        }
        // Hash password if it's modified or new
        if (this.isModified('password')) {
            this.password = yield bcrypt_1.default.hash(this.password, Number(config_1.default.bcrypt_salt_rounds));
        }
        // Default verification status as false for new users
        if (this.isNew) {
            this.verified = false; // Ensure the user is not verified initially
        }
        next();
    });
});
exports.User = (0, mongoose_1.model)("User", userSchema);
