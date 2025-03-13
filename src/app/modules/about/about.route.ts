import express from 'express';
import { AboutController } from './about.controller';

const router = express.Router();

router.post('/', AboutController.createAbout);
router.get('/', AboutController.getAllAbout);
export const AboutRoutes = router;
