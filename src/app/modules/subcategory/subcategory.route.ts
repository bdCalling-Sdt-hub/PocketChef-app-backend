import express from 'express';
import { SubcategoryController } from './subcategory.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.post('/create',
    auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
    SubcategoryController.createSubCategory);
router.get("/", SubcategoryController.getAllSubCategory)

router.delete("/:id", auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), SubcategoryController.deleteSubcategory)
router.patch("/:id", auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), SubcategoryController.updateSubcategory)

export const SubcategoryRoutes = router;
