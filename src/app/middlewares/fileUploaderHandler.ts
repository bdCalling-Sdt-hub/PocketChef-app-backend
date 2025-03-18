import { Request } from 'express';
import fs from 'fs';
import { StatusCodes } from 'http-status-codes';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';

const fileUploadHandler = () => {
    const baseUploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(baseUploadDir)) {
        fs.mkdirSync(baseUploadDir);
    }

    const createDir = (dirPath: string) => {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
        }
    };

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            let uploadDir;
            switch (file.fieldname) {
                case 'image':
                    uploadDir = path.join(baseUploadDir, 'images');
                    break;
                case 'video':
                    uploadDir = path.join(baseUploadDir, 'videos');
                    break;
                case "profile":
                    uploadDir = path.join(baseUploadDir, 'profiles');
                    break;
                case "category":
                    uploadDir = path.join(baseUploadDir, "category")
                    break
                case "instructions":
                    uploadDir = path.join(baseUploadDir, "instructions")
                    break
                case "bannerImages":
                    uploadDir = path.join(baseUploadDir, "bannerImages")
                    break
                case "ingredientImages":
                    uploadDir = path.join(baseUploadDir, "ingredientImages")
                    break
                default:
                    return cb(new Error('File type is not supported'), '');
            }
            createDir(uploadDir);
            cb(null, uploadDir);
        },

        filename: (req, file, cb) => {
            const fileExt = path.extname(file.originalname);
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

    const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
        const allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/vnd.microsoft.icon'];
        const allowedVideoTypes = ['video/mp4', 'video/mkv', 'video/avi'];



        if (file.fieldname === 'image' && allowedImageTypes.includes(file.mimetype)) {
            cb(null, true);
        } else if (file.fieldname === 'video' && allowedVideoTypes.includes(file.mimetype)) {
            cb(null, true);
        } else if (file.fieldname === 'profile' && allowedImageTypes.includes(file.mimetype)) {
            cb(null, true);
        } else if (file.fieldname === 'category' && allowedImageTypes.includes(file.mimetype)) {
            cb(null, true);
        } else if (file.fieldname === 'instructions' && allowedImageTypes.includes(file.mimetype)) {
            cb(null, true);
        } else if (file.fieldname === 'bannerImages' && allowedImageTypes.includes(file.mimetype)) {
            cb(null, true);
        } else if (file.fieldname === 'ingredientImages' && allowedImageTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(null, false);
        }

    };



    return multer({
        storage,
        fileFilter: fileFilter as unknown as multer.Options['fileFilter']
    }).fields([
        { name: 'image', maxCount: 3 },
        { name: 'video', maxCount: 2 },
        { name: 'profile', maxCount: 1 },
        { name: 'category', maxCount: 1 },
        { name: 'instructions', maxCount: 1 },
        { name: 'bannerImages', maxCount: 1 },
        { name: 'ingredientImages', maxCount: 1 }
    ]);
};

export default fileUploadHandler;
