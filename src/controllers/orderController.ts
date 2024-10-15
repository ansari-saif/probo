import { Request, Response } from 'express';
import { CLOSURE_AMOUNT, INR_BALANCES, ORDERBOOK, STOCK_BALANCES } from '../db';
const getStockType = (val: string) => val == "yes" ? "no" : "yes";
const getPrice = (val: number) => CLOSURE_AMOUNT - val
export const placeBuyOrder = (req: Request, res: Response) => {
    const { stockSymbol, stockType, price, quantity, userId }: {
        stockSymbol: string;
        stockType: 'yes' | 'no';
        price: number;
        quantity: number;
        userId: string
    } = req.body;
    const updatedStockType = getStockType(stockType);
    const updatedPrice = getPrice(price);
    // Check if user exists in INR_BALANCES
    if (!INR_BALANCES[userId]) {
        return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const totalCost = price * quantity;

    // Check if user has enough INR balance
    if (INR_BALANCES[userId].balance < totalCost) {
        return res.status(400).json({ success: false, message: 'Insufficient INR balance.' });
    }

    // Deduct the amount from INR_BALANCES
    INR_BALANCES[userId].balance -= totalCost;
    // INR_BALANCES[userId].locked += totalCost;

    // Update the STOCK_BALANCES ledger
    STOCK_BALANCES[userId] ??= {};
    STOCK_BALANCES[userId][stockSymbol] ??= {};
    STOCK_BALANCES[userId][stockSymbol][stockType] ??= { quantity: 0, locked: 0 };

    STOCK_BALANCES[userId][stockSymbol][stockType].quantity += quantity;

    // Initialize the order book if necessary
    ORDERBOOK[stockSymbol] ??= { yes: {}, no: {} };
    ORDERBOOK[stockSymbol][updatedStockType][updatedPrice] ??= { total: 0, orders: {} };

    // Add to the order book
    const orderEntry = ORDERBOOK[stockSymbol][updatedStockType][updatedPrice];
    orderEntry.total += quantity;
    orderEntry.orders[userId] = (orderEntry.orders[userId] || 0) + quantity;

    res.json({
        success: true,
        message: `Buy order placed for ${quantity} '${updatedStockType}' options at price ${price}.`,
        order: { stockSymbol, stockType, price, quantity },
        remainingBalance: INR_BALANCES[userId],
        updatedStockBalance: STOCK_BALANCES[userId][stockSymbol][updatedStockType]
    });
};


export const placeSellOrder = (req: Request, res: Response) => {
    const { stockSymbol, stockType, price, quantity, userId }: {
        stockSymbol: string;
        stockType: 'yes' | 'no';
        price: number;
        quantity: number;
        userId: string
    } = req.body;

    // Check if user exists in INR_BALANCES
    if (!INR_BALANCES[userId]) {
        return res.status(404).json({ success: false, message: 'User not found in INR balances.' });
    }

    // Check if user has stock options in STOCK_BALANCES
    const userStockBalance = STOCK_BALANCES[userId]?.[stockSymbol]?.[stockType];
    if (!userStockBalance || userStockBalance.quantity < quantity) {
        return res.status(400).json({ success: false, message: 'Insufficient stock options to sell.' });
    }

    const totalSellValue = price * quantity;

    // Deduct the stock options from the user's holdings
    userStockBalance.quantity -= quantity;


    // TODO : check if entry exists on ORDERBOOK on same or higher and place order if not exits then lock it in STOCK_BALANCES


    // Send success response
    res.json({
        success: true,
        message: `Sell order placed for ${quantity} '${stockType}' options at price ${price}.`,
        order: { stockSymbol, stockType, price, quantity },
        updatedINRBalance: INR_BALANCES[userId].balance,
        remainingStockBalance: userStockBalance
    });
};