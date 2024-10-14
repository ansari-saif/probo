// src/controllers/orderbookController.ts

import { Request, Response } from 'express';
import { ORDERBOOK } from '../models/symbol';

export const getOrderBook = (req: Request, res: Response) => {
    try {
        return res.status(200).json(ORDERBOOK);
    } catch (error) {
        return res.status(500).json({ message: 'An error occurred while fetching the order book', error });
    }
};
