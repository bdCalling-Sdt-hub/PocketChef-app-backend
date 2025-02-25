import express, { NextFunction } from 'express';
import { USER_ROLES } from '../../../enums/user';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import fileUploadHandler from '../../middlewares/fileUploaderHandler';
import { getMultipleFilesPath, getSingleFilePath } from '../../../shared/getFilePath';
import sendResponse from '../../../shared/sendResponse';
import { UserService } from './user.service';
import { StatusCodes } from 'http-status-codes';
const router = express.Router();

router.get(
    '/profile',
    auth(USER_ROLES.ADMIN, USER_ROLES.USER),
    UserController.getUserProfile
);
router.patch('/profile',
    auth(USER_ROLES.ADMIN, USER_ROLES.USER),
    fileUploadHandler() as any,
    UserController.updateProfile
);









router.post(
    '/create-admin',
    validateRequest(UserValidation.createAdminZodSchema),
    UserController.createAdmin
);

router
    .route('/')
    .post(
        UserController.createUser
    )
    .patch(
        // auth(USER_ROLES.ADMIN, USER_ROLES.USER),
        fileUploadHandler() as any,
        UserController.updateProfile
    );
router.route("/verify-otp").post(UserController.verifyOtp);
export const UserRoutes = router;