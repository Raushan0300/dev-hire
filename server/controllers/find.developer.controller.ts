import { Request, Response } from 'express';
import DeveloperProfile from '../models/DeveloperProfile.js';

export const findDeveloper = async (_req: Request, res: Response) => {
    try {
        const developers = await DeveloperProfile.find().select('-user -__v');
        res.json(developers);
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};