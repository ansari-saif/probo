
// src/routes/orderbookRoutes.ts

import express from 'express';
import { buyYesStock, getOrderBook } from '../controllers/orderbookController';

const router = express.Router();

// Define the GET endpoint for /orderbook
router.get('/', getOrderBook);
router.get('/buy/yes', buyYesStock);

export default router;
