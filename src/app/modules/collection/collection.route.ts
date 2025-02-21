import express from 'express';
import { CollectionController } from './collection.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.post('/create', auth(USER_ROLES.USER), CollectionController.createController);

export const CollectionRoutes = router;
