import { INR_BALANCES, ORDERBOOK, STOCK_BALANCES } from "../db";
import { Request, Response } from "express";
export const resetData = (req: Request, res: Response) => {
    Object.keys(INR_BALANCES).forEach(key => delete INR_BALANCES[key]);
    Object.keys(STOCK_BALANCES).forEach(key => delete STOCK_BALANCES[key]);
    Object.keys(ORDERBOOK).forEach(key => delete ORDERBOOK[key]);
    res.status(200).json({ status: "success"});
};
