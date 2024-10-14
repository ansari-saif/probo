// src/controllers/orderbookController.ts

import { Request, Response } from 'express';
import { ORDERBOOK } from '../db';

export const getOrderBook = (req: Request, res: Response) => {
    try {
        return res.status(200).json(ORDERBOOK);
    } catch (error) {
        return res.status(500).json({ message: 'An error occurred while fetching the order book', error });
    }
};

// Utility function to place an order
const placeOrder = (
    userId: string,
    stockSymbol: string,
    quantity: number,
    price: number,
    option: 'yes' | 'no'
): string | null => {
    // Create or update the order in the ORDERBOOK
    if (!ORDERBOOK[stockSymbol]) {
        ORDERBOOK[stockSymbol] = {
            yes: {},
            no: {}
        };
    }

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

    return null; // Indicate success
};

// Place buy order for "yes" options
export const buyYesStock = (req: Request, res: Response) => {
    const { userId, stockSymbol, quantity, price } = req.body;

    // Validate input
    if (!userId || !stockSymbol || quantity <= 0 || price <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid input. Please provide valid userId, stockSymbol, quantity, and price.'
        });
    }

    placeOrder(userId, stockSymbol, quantity, price, 'yes');

    res.status(201).json({
        success: true,
        message: 'Buy order for "yes" placed successfully.',
        order: {
            stockSymbol,
            price,
            quantity
        }
    });
};

// Place sell order for "yes" options
export const sellYesStock = (req: Request, res: Response) => {
    const { userId, stockSymbol, quantity, price } = req.body;

    // Validate input
    if (!userId || !stockSymbol || quantity <= 0 || price <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid input. Please provide valid userId, stockSymbol, quantity, and price.'
        });
    }

    placeOrder(userId, stockSymbol, quantity, price, 'yes');

    res.status(201).json({
        success: true,
        message: 'Sell order for "yes" placed successfully.',
        order: {
            stockSymbol,
            price,
            quantity
        }
    });
};

// Place buy order for "no" options
export const buyNoStock = (req: Request, res: Response) => {
    const { userId, stockSymbol, quantity, price } = req.body;

    // Validate input
    if (!userId || !stockSymbol || quantity <= 0 || price <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid input. Please provide valid userId, stockSymbol, quantity, and price.'
        });
    }

    placeOrder(userId, stockSymbol, quantity, price, 'no');

    res.status(201).json({
        success: true,
        message: 'Buy order for "no" placed successfully.',
        order: {
            stockSymbol,
            price,
            quantity
        }
    });
};

// Place sell order for "no" options
export const sellNoStock = (req: Request, res: Response) => {
    const { userId, stockSymbol, quantity, price } = req.body;

    // Validate input
    if (!userId || !stockSymbol || quantity <= 0 || price <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid input. Please provide valid userId, stockSymbol, quantity, and price.'
        });
    }

    placeOrder(userId, stockSymbol, quantity, price, 'no');

    res.status(201).json({
        success: true,
        message: 'Sell order for "no" placed successfully.',
        order: {
            stockSymbol,
            price,
            quantity
        }
    });
};


