import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import developerUser from "../models/Developer.js";

import DeveloperProfile from "../models/DeveloperProfile.js";

export const developerSignupController = async (req: Request, res: Response) => {
    const { email, password, fullName, walletAddress, title, hourlyRate } = req.body;

    if (!email || !password || !fullName || !walletAddress || !title || !hourlyRate) {
        res.status(400).json({ message: "Please enter all fields" });
        return;
    }

    try {
        const developer = await developerUser.findOne({ email });
        if (developer) {
            res.status(400).json({ message: "User already exists" });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const newDeveloper = new developerUser({
            email,
            password: hash,
            fullName,
            title,
            hourlyRate: hourlyRate * 10000,
            walletAddress,

        });

        await newDeveloper.save();
        const newDeveloperProfile = new DeveloperProfile({
            user: newDeveloper._id,
            fullName,
            title,
            hourlyRate: hourlyRate * 10000,


        });
        await newDeveloperProfile.save();

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined");
        }
        const token = jwt.sign({ id: newDeveloper._id, role: "developer" }, process.env.JWT_SECRET, {
            expiresIn: 3600,
        });
        res.json({
            token,
            developer: {
                email: newDeveloper.email,
                fullName: newDeveloper.fullName,
                walletAddress: newDeveloper.walletAddress,
            },
        });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
        return;
    }
};

export const developerLoginController = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ message: "Please enter all fields" });
        return;
    }

    try {
        const developer = await developerUser.findOne({ email });
        if (!developer) {
            res.status(400).json({ message: "User does not exist" });
            return;
        }

        const isMatch = await bcrypt.compare(password, developer.password);
        if (!isMatch) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined");
        }
        const token = jwt.sign({ id: developer._id, role: "developer" }, process.env.JWT_SECRET, {
            expiresIn: 3600,
        });
        res.json({
            token,
            developer: {
                email: developer.email,
                fullName: developer.fullName,
                walletAddress: developer.walletAddress,
            },
        });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
        return;
    }
};
