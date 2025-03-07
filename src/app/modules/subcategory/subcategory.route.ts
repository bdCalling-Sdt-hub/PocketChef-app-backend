import express from 'express';
import { SubcategoryController } from './subcategory.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.post('/create', auth(USER_ROLES.ADMIN), SubcategoryController.createSubCategory);
router.get("/", SubcategoryController.getAllSubCategory)
export const SubcategoryRoutes = router;
