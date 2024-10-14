
import { Request, Response } from 'express';
import { INR_BALANCES, ORDERBOOK } from '../db';


const hasSufficientBalance = (userId: string, quantity: number): boolean => {
    const userBalance = INR_BALANCES[userId];
    return userBalance && userBalance.balance >= quantity;
};

// Mint fresh tokens
export const mintTokens = (req: Request, res: Response) => {
    const { userId, stockSymbol, quantity } = req.body;

    // Validate input
    if (!userId || !stockSymbol || quantity <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid input. Please provide valid userId, stockSymbol, and quantity.'
        });
    }

    // Check if user has sufficient balance
    if (!hasSufficientBalance(userId, quantity)) {
        return res.status(400).json({
            success: false,
            message: 'Insufficient balance to mint tokens.'
        });
    }

    // Update the balance
    INR_BALANCES[userId].balance -= quantity;

    // Update the ORDERBOOK with the new minted tokens
    if (!ORDERBOOK[stockSymbol]) {
        ORDERBOOK[stockSymbol] = {
            yes: {},
            no: {}
        };
    }

    // Mint the tokens by updating the ORDERBOOK
    const price = 1; // Assume a default price for minting
    if (!ORDERBOOK[stockSymbol]['yes'][price]) {
        ORDERBOOK[stockSymbol]['yes'][price] = {
            total: 0,
            orders: {}
        };
    }

    ORDERBOOK[stockSymbol]['yes'][price].total += quantity;

    if (!ORDERBOOK[stockSymbol]['yes'][price].orders[userId]) {
        ORDERBOOK[stockSymbol]['yes'][price].orders[userId] = 0;
    }

    ORDERBOOK[stockSymbol]['yes'][price].orders[userId] += quantity;

    res.status(200).json({
        success: true,
        message: 'Minted tokens successfully.',
        minted: {
            stockSymbol,
            quantity
        }
    });
};
