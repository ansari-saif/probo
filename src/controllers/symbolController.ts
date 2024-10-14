// src/controllers/symbolController.ts

import { Request, Response } from 'express';
import { ORDERBOOK } from '../models/symbol';

export const createSymbol = (req: Request, res: Response) => {
    const { stockSymbol } = req.params;

    // Check if the stock symbol already exists
    if (ORDERBOOK[stockSymbol]) {
        return res.status(400).json({ message: 'Symbol already exists' });
    }

    // Initialize the symbol with default values
    ORDERBOOK[stockSymbol] = {
        yes: {
            "9.5": { total: 12, orders: { "user1": 2, "user2": 10 } },
            "8.5": { total: 12, orders: { "user1": 3, "user2": 3, "user3": 6 } }
        },
        no: {}
    };

    res.status(201).json({ message: 'Symbol created successfully', symbol: ORDERBOOK[stockSymbol] });
};
