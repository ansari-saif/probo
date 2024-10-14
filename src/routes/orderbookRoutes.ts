
// src/routes/orderbookRoutes.ts

import express from 'express';
import { getOrderBook } from '../controllers/orderbookController';

const router = express.Router();

// Define the GET endpoint for /orderbook
router.get('/', getOrderBook);

export default router;
