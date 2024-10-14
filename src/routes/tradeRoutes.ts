
// src/routes/orderbookRoutes.ts

import express from 'express';
import { mintTokens } from '../controllers/tradeController';

const router = express.Router();

router.post('/mint', mintTokens);


export default router;
