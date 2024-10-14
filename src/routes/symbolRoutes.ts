// src/routes/symbolRoutes.ts

import { Router } from 'express';
import { createSymbol } from '../controllers/symbolController';

const router = Router();

router.post('/create/:stockSymbol', createSymbol);

export default router;
