import { Request, Response } from 'express';
import { INR_BALANCES, ORDERBOOK, STOCK_BALANCES } from '../db';

const hasSufficientBalance = (userId: string, totalCost: number): boolean => {
    const userBalance = INR_BALANCES[userId];
    return userBalance && userBalance.balance >= totalCost;
};

// Mint fresh tokens
export const mintTokens = (req: Request, res: Response) => {
    const { userId, stockSymbol, quantity, price } = req.body;

    // Validate input
    if (!userId || !stockSymbol || quantity <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid input. Please provide valid userId, stockSymbol, and quantity.'
        });
    }

    const totalCost = quantity * price * 2;  // cost for minting both 'yes' and 'no' tokens

    // Check if user has sufficient balance
    if (!hasSufficientBalance(userId, totalCost)) {
        return res.status(400).json({
            success: false,
            message: 'Insufficient balance to mint tokens.'
        });
    }

    // Deduct the total cost from the user's INR balance
    INR_BALANCES[userId].balance -= totalCost;

    // Initialize the ORDERBOOK if necessary
    ORDERBOOK[stockSymbol] ??= { yes: {}, no: {} };

    // Mint the 'yes' tokens
    ORDERBOOK[stockSymbol]['yes'][price] ??= { total: 0, orders: {} };
    ORDERBOOK[stockSymbol]['yes'][price].total += quantity;
    ORDERBOOK[stockSymbol]['yes'][price].orders[userId] = (ORDERBOOK[stockSymbol]['yes'][price].orders[userId] || 0) + quantity;

    // Mint the 'no' tokens
    ORDERBOOK[stockSymbol]['no'][price] ??= { total: 0, orders: {} };
    ORDERBOOK[stockSymbol]['no'][price].total += quantity;
    ORDERBOOK[stockSymbol]['no'][price].orders[userId] = (ORDERBOOK[stockSymbol]['no'][price].orders[userId] || 0) + quantity;

    // Update STOCK_BALANCES for the user
    STOCK_BALANCES[userId] ??= {};
    STOCK_BALANCES[userId][stockSymbol] ??= { yes: { quantity: 0, locked: 0 }, no: { quantity: 0, locked: 0 } };

    // Ensure user and stock symbol exist in STOCK_BALANCES
    if (
        STOCK_BALANCES[userId] &&
        STOCK_BALANCES[userId][stockSymbol] &&
        STOCK_BALANCES[userId][stockSymbol].yes &&
        STOCK_BALANCES[userId][stockSymbol].no
    ) {
        STOCK_BALANCES[userId][stockSymbol].yes.quantity += quantity;
        STOCK_BALANCES[userId][stockSymbol].no.quantity += quantity;
    } else {
        throw new Error('Stock balance entry does not exist.');
    }

    const remainingBalance = INR_BALANCES[userId].balance;

    res.status(200).json({
        success: true,
        message: `Minted ${quantity} 'yes' and 'no' tokens for user ${userId}, remaining balance is ${remainingBalance}`,
        minted: {
            stockSymbol,
            quantity
        },
        remainingBalance,
        stockBalances: STOCK_BALANCES[userId][stockSymbol]
    });
};
