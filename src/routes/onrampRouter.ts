
import express from 'express';
import { onrampINR } from '../controllers/balanceController';

const router = express.Router();

router.post('/inr', onrampINR);


export default router;
