// src/routes/balanceRoutes.ts
import { Router } from 'express';
import { getINRBalanceByUserId, getINRBalances, getStockBalanceByUserId, getStockBalances, onrampINR } from '../controllers/balanceController';

const router = Router();

router.get('/inr', getINRBalances);
router.get('/inr/:userId', getINRBalanceByUserId);
router.get('/stock', getStockBalances);
router.post('/onramp/inr', onrampINR);
router.get('/stock/:userId', getStockBalanceByUserId);



export default router;
