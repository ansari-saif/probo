import { User } from "../models/user";
import { Request, Response } from "express";
const INR_BALANCES: Record<string, User> = {};
export const createUser = (req: Request, res: Response) => {
    let userId : string= req.params.userId;
    if (!userId){
        userId = "0";
    }
    if (INR_BALANCES[userId]) {
        return res.status(400).json({ message: "User ID already exists." });
    }
    const user: User = {
        balance: 0,
        locked: 0,
    };
    INR_BALANCES[userId] = user;
    res.status(201).json({ userId, ...user });
};

export const getUsers = (req: Request, res: Response) => {
    res.json(INR_BALANCES);
};