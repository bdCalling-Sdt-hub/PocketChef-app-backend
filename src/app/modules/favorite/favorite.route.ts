import express from 'express';
import { FavoriteController } from './favorite.controller';

const router = express.Router();

router.get('/', FavoriteController); 

export const FavoriteRoutes = router;
