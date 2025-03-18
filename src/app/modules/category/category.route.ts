import express from 'express'
import { USER_ROLES } from '../../../enums/user'
import auth from '../../middlewares/auth'
import validateRequest from '../../middlewares/validateRequest'
import { CategoryController } from './category.controller'
import { CategoryValidation } from './category.validation'
import fileUploadHandler from '../../middlewares/fileUploaderHandler'
const router = express.Router()

router.post(
  '/create-service',
  // auth(USER_ROLES.ADMIN),
  fileUploadHandler() as any,
  validateRequest(CategoryValidation.createCategoryZodSchema),
  CategoryController.createCategory,
)

router
  .route('/category/:id')
  .patch(
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    // @ts-ignore
    fileUploadHandler(),
    CategoryController.updateCategory,
  )
  .delete(
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    CategoryController.deleteCategory,
  )

router.get('/category',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.USER),
  CategoryController.getCategories,
)

export const CategoryRoutes = router