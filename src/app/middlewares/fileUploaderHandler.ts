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
        const allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        const allowedVideoTypes = ['video/mp4', 'video/mkv', 'video/avi'];

        if (file.fieldname === 'image' && allowedImageTypes.includes(file.mimetype)) {
            cb(null, true);
        } else if (file.fieldname === 'video' && allowedVideoTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only .jpeg, .png, .jpg for images & .mp4, .mkv, .avi for videos are supported'), false);
        }
    };

    return multer({
        storage,
        fileFilter
    }).fields([
        { name: 'image', maxCount: 3 },
        { name: 'video', maxCount: 2 }
    ]);
};

export default fileUploadHandler;
