import express from 'express';
import { FavoritecollectionController } from './favoritecollection.controller';

const router = express.Router();

router.get('/', FavoritecollectionController); 

export const FavoritecollectionRoutes = router;
