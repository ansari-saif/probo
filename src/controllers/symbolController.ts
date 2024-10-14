// src/controllers/symbolController.ts

import { Request, Response } from 'express';
import { ORDERBOOK } from '../db';

export const createSymbol = (req: Request, res: Response) => {
    const { stockSymbol } = req.params;

    // Check if the stock symbol already exists
    if (ORDERBOOK[stockSymbol]) {
        return res.status(400).json({ message: 'Symbol already exists' });
    }

    // Initialize the symbol with default values
    ORDERBOOK[stockSymbol] = {
        yes: {},
        no: {}
    };

    res.status(201).json({ message: 'Symbol created successfully', symbol: ORDERBOOK[stockSymbol] });
};
