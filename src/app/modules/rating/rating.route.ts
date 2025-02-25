import express from 'express';
import { ratingController } from './rating.controller';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { ratingValidations } from './rating.validation';

const router = express.Router();

router.post('/create', auth(USER_ROLES.USER), validateRequest(ratingValidations.createRatingZodSchema), ratingController.createRating);

export const ratingRoutes = router;
