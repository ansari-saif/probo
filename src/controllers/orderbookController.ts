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

export const buyYesStock = (req: Request, res: Response) => {
    const { userId, stockSymbol, quantity, price } = req.body;

    // Validate input
    if (!userId || !stockSymbol || quantity <= 0 || price <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid input. Please provide valid userId, stockSymbol, quantity, and price.'
        });
    }

    // Create or update the order in the ORDERBOOK
    if (!ORDERBOOK[stockSymbol]) {
        ORDERBOOK[stockSymbol] = {
            yes: {},
            no: {}
        };
    }

    const option = 'yes'; // We are only handling 'yes' orders in this example

    // Check if the price level exists
    if (!ORDERBOOK[stockSymbol][option][price]) {
        ORDERBOOK[stockSymbol][option][price] = {
            total: 0,
            orders: {}
        };
    }

    // Update the order
    ORDERBOOK[stockSymbol][option][price].total += quantity;

    if (!ORDERBOOK[stockSymbol][option][price].orders[userId]) {
        ORDERBOOK[stockSymbol][option][price].orders[userId] = 0;
    }

    ORDERBOOK[stockSymbol][option][price].orders[userId] += quantity;

    // Respond with success
    res.status(201).json({
        success: true,
        message: 'Order placed successfully.',
        order: {
            stockSymbol,
            price,
            quantity
        }
    });
};
