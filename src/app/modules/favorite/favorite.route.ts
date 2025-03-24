import express from 'express';
import { FavoriteController } from './favorite.controller';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post('/', auth(USER_ROLES.USER, USER_ROLES.ADMIN), FavoriteController.createFavorite);
router.get('/', auth(USER_ROLES.USER, USER_ROLES.ADMIN), FavoriteController.getAllFavorite);
router.get('/:id', auth(USER_ROLES.USER, USER_ROLES.ADMIN), FavoriteController.getSingleFavorite);
router.patch('/:id', auth(USER_ROLES.USER, USER_ROLES.ADMIN), FavoriteController.updateFavorite);
router.delete('/:id', auth(USER_ROLES.USER, USER_ROLES.ADMIN), FavoriteController.deleteFavorite);

// recent favorite
router.get('/new-recent-favorite', FavoriteController.getRecentFavorite);



export const FavoriteRoutes = router;
