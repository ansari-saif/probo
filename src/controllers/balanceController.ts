// src/controllers/balanceController.ts
import { Request, Response } from 'express';
import { INR_BALANCES, STOCK_BALANCES } from '../db';


export const getINRBalances = (req: Request, res: Response): void => {
    try {
        res.status(200).json({
            success: true,
            data: INR_BALANCES
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching the INR balances.'
        });
    }
};

export const getINRBalanceByUserId = (req: Request, res: Response): void => {
    const userId = req.params.userId;

    // Check if the user exists in INR_BALANCES
    if (INR_BALANCES[userId]) {
        res.status(200).json({
            success: true,
            data: INR_BALANCES[userId]
        });
    } else {
        res.status(404).json({
            success: false,
            message: `User with ID ${userId} not found.`
        });
    }
};

export const getStockBalances = (req: Request, res: Response): void => {
    try {
        res.status(200).json({
            success: true,
            data: STOCK_BALANCES
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching the stock balances.'
        });
    }
};

export const onrampINR = (req: Request, res: Response) => {
    const { userId, amount } = req.body;

    // Validate request body
    if (!userId || typeof userId !== 'string' || amount === undefined || typeof amount !== 'number') {
        return res.status(400).json({
            success: false,
            message: 'Invalid input data. Please provide userId and amount in paise.'
        });
    }

    // Check if the user exists in INR_BALANCES
    if (!INR_BALANCES[userId]) {
        return res.status(404).json({
            success: false,
            message: `User with ID ${userId} not found.`
        });
    }

    // Update the balance (add the amount)
    INR_BALANCES[userId].balance += amount;

    res.status(200).json({
        success: true,
        message: `Onramped ${userId} with amount ${amount}`,
        balance: INR_BALANCES[userId].balance
    });
    
};

// Get stock balance for a specific user
export const getStockBalanceByUserId = (req: Request, res: Response) => {
    const { userId } = req.params;

    // Check if the user exists in STOCK_BALANCES
    if (!STOCK_BALANCES[userId]) {
        return res.status(404).json({
            success: false,
            message: `No stock balance found for user ID ${userId}.`
        });
    }

    // Return the user's stock balance
    res.status(200).json({
        success: true,
        data: STOCK_BALANCES[userId]
    });
};
