import express from 'express';
import { AddtogroceryController } from './addtogrocery.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.get('/', auth(USER_ROLES.USER, USER_ROLES.ADMIN), AddtogroceryController.getGrocery);
router.post('/', auth(USER_ROLES.USER, USER_ROLES.ADMIN), AddtogroceryController.addToGrocery);
router.get('/:id', auth(USER_ROLES.USER, USER_ROLES.ADMIN), AddtogroceryController.getGroceryById);

router.get('/', auth(USER_ROLES.USER, USER_ROLES.ADMIN), AddtogroceryController.getAllGrocery);
router.patch('/:id', AddtogroceryController.updateGrocery);
router.delete('/:id', AddtogroceryController.deleteGrocery);

export const AddtogroceryRoutes = router;
