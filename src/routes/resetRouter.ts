
import express from 'express';
import { resetData } from '../controllers/commonController';

const router = express.Router();

router.post('/', resetData);


export default router;
