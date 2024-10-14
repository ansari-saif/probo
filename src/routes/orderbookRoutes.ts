
// src/routes/orderbookRoutes.ts

import express from 'express';
import { buyNoStock, buyYesStock, getOrderBook, sellNoStock, sellYesStock } from '../controllers/orderbookController';

const router = express.Router();

// Define the GET endpoint for /orderbook
router.get('/', getOrderBook);
router.post('/buy/yes', buyYesStock);
router.post('/sell/yes', sellYesStock);
router.post('/buy/no', buyNoStock);
router.post('/sell/no', sellNoStock);

export default router;
