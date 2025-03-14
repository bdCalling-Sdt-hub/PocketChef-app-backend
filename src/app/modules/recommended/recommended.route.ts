import express from 'express';
import { RecommendedController } from './recommended.controller';

const router = express.Router();

router.get('/top-rated', RecommendedController.getTopRatedRecipes);

export const RecommendedRoutes = router;
