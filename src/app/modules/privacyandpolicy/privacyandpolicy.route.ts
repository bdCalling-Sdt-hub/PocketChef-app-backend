import express from 'express';
import { PrivacyandpolicyController } from './privacyandpolicy.controller';
import validateRequest from '../../middlewares/validateRequest';
import { PrivacyandpolicyValidations } from './privacyandpolicy.validation';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.post('/', auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), validateRequest(PrivacyandpolicyValidations.createPrivacyandpolicyZodSchema), PrivacyandpolicyController.createPrivacyandpolicy);
router.get('/', PrivacyandpolicyController.getAllPrivacyandpolicy);



export const PrivacyandpolicyRoutes = router;
