import { Request, Response } from 'express';
import { ORDERBOOK, STOCK_BALANCES } from '../db';

export const placeBuyOrder = (req: Request, res: Response) => {
    const { stockSymbol, stockType, price, quantity, userId }: { 
        stockSymbol: string; 
        stockType: 'yes' | 'no'; 
        price: number; 
        quantity: number; 
        userId: string 
    } = req.body;

    // Check if user exists
    if (!STOCK_BALANCES[userId]) {
        return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Initialize the order book if necessary
    ORDERBOOK[stockSymbol] ??= { yes: {}, no: {} };
    ORDERBOOK[stockSymbol][stockType][price] ??= { total: 0, orders: {} };

    // Add to the order book
    const orderEntry = ORDERBOOK[stockSymbol][stockType][price];
    orderEntry.total += quantity;
    orderEntry.orders[userId] = (orderEntry.orders[userId] || 0) + quantity;

    res.json({ success: true, message: 'Buy order placed.', order: { stockSymbol, stockType, price, quantity } });
};

export const placeSellOrder = (req: Request, res: Response) => {
    const { stockSymbol, stockType, price, quantity, userId }: {
        stockSymbol: string; 
        stockType: 'yes' | 'no'; 
        price: number; 
        quantity: number; 
        userId: string 
    } = req.body;

    // Check if user exists
    if (!STOCK_BALANCES[userId]) {
        return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Initialize the order book if necessary
    ORDERBOOK[stockSymbol] ??= { yes: {}, no: {} };
    ORDERBOOK[stockSymbol][stockType][price] ??= { total: 0, orders: {} };

    // Add to the order book
    const orderEntry = ORDERBOOK[stockSymbol][stockType][price];
    orderEntry.total += quantity;
    orderEntry.orders[userId] = (orderEntry.orders[userId] || 0) + quantity;

    res.json({ success: true, message: 'Sell order placed.', order: { stockSymbol, stockType, price, quantity } });
};
