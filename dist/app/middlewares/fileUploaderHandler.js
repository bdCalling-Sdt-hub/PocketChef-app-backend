"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fileUploadHandler = () => {
    const baseUploadDir = path_1.default.join(process.cwd(), 'uploads');
    if (!fs_1.default.existsSync(baseUploadDir)) {
        fs_1.default.mkdirSync(baseUploadDir);
    }
    const createDir = (dirPath) => {
        if (!fs_1.default.existsSync(dirPath)) {
            fs_1.default.mkdirSync(dirPath);
        }
    };
    const storage = multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            let uploadDir;
            switch (file.fieldname) {
                case 'image':
                    uploadDir = path_1.default.join(baseUploadDir, 'images');
                    break;
                case 'video':
                    uploadDir = path_1.default.join(baseUploadDir, 'videos');
                    break;
                default:
                    return cb(new Error('File type is not supported'), '');
            }
            createDir(uploadDir);
            cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
            const fileExt = path_1.default.extname(file.originalname);
            const fileName = file.originalname
                .replace(fileExt, '')
                .toLowerCase()
                .split(' ')
                .join('-') +
                '-' +
                Date.now();
            cb(null, fileName + fileExt);
        },
    });
    const fileFilter = (req, file, cb) => {
        const allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        const allowedVideoTypes = ['video/mp4', 'video/mkv', 'video/avi'];
        if (file.fieldname === 'image' && allowedImageTypes.includes(file.mimetype)) {
            cb(null, true);
        }
        else if (file.fieldname === 'video' && allowedVideoTypes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error('Only .jpeg, .png, .jpg for images & .mp4, .mkv, .avi for videos are supported'), false);
        }
    };
    return (0, multer_1.default)({
        storage,
        fileFilter
    }).fields([
        { name: 'image', maxCount: 3 },
        { name: 'video', maxCount: 2 }
    ]);
};
exports.default = fileUploadHandler;
