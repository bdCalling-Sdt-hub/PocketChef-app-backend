import express from 'express';
import { RetingController } from './reting.controller';
import validateRequest from '../../middlewares/validateRequest';
import { RetingValidations } from './reting.validation';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.post('/', auth(USER_ROLES.USER), validateRequest(RetingValidations.createRetingZodSchema), RetingController.createReting);

export const RetingRoutes = router;
