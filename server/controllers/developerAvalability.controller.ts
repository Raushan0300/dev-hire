import { Request, Response } from "express";
import DeveloperProfile from "../models/DeveloperProfile.js";

export const developerAvailabilityController = async (req: Request, res: Response) => {
    const {availability,} = req.body;
    const {id, role} =req.body?.user;
    
    try {
        if(role !== "developer"){
            res.status(400).json({message:"You are not a developer"});
            return;
        };
    
        if (!availability) {
            res.status(400).json({ message: "Please enter all fields" });
            return;
        }

        const developerProfile = await DeveloperProfile.findOne({ user: id });
        if (!developerProfile) {
            res.status(400).json({ message: "Developer not found" });
            return;
        }

        developerProfile.availability = availability;
        await developerProfile.save();

        res.json({ message: "Availability updated" });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
        return;
    }
};