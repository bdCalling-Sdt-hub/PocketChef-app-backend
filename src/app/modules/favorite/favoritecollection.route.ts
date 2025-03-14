import express from 'express';
import { FavoritecollectionController } from './favorite.controller';

const router = express.Router();

router.get('/', FavoritecollectionController);

export const FavoritecollectionRoutes = router;
