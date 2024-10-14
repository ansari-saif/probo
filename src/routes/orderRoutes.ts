import { placeBuyOrder, placeSellOrder } from '../controllers/orderController';
import express from 'express';
const router = express.Router();

router.post('/buy', placeBuyOrder);
router.post('/sell', placeSellOrder);

export default router;
