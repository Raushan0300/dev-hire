import { Request, Response } from "express";
import DeveloperProfile from "../models/DeveloperProfile.js";
import Unavailability from "../models/Unavailability.js";

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

export const developerSetUnavailaibitycontroller = async(req: Request, res: Response) => {
    const {date, times} = req.body;
    const {id, role} = req.body?.user;

    try {
        if(role !== "developer"){
            res.status(400).json({message:"You are not a developer"});
            return;
        }

        if (!date || !times || !Array.isArray(times)) {
            res.status(400).json({ message: "Please provide valid date and time slots" });
            return;
        }

        const developerProfile = await DeveloperProfile.findOne({ user: id });
        if (!developerProfile) {
            res.status(400).json({ message: "Developer not found" });
            return;
        }

        let unavailability = await Unavailability.findOne({ developer: developerProfile._id });
        
        if (!unavailability) {
            // Create new unavailability record
            unavailability = new Unavailability({
                developer: developerProfile._id,
                timeSlots: [{
                    date: new Date(date),
                    time: times
                }]
            });
        } else {
            // Update existing timeSlots
            const dateIndex = unavailability.timeSlots.findIndex(
                slot => new Date(slot.date).toDateString() === new Date(date).toDateString()
            );

            if (dateIndex >= 0) {
                // Update existing date's time slots
                unavailability.timeSlots[dateIndex].time = times;
            } else {
                // Add new date with time slots
                unavailability.timeSlots.push({
                    date: new Date(date),
                    time: times
                });
            }
        }

        await unavailability.save();
        res.json({ message: "Availability updated successfully", unavailability });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

export const getDeveloperAvailability = async (req: Request, res: Response) => {
    const { id, role } = req.body?.user;

    try {
        if(role === 'developer'){
            const developerProfile = await DeveloperProfile.findOne({ user: id });
            if (!developerProfile) {
                res.status(400).json({ message: "Developer not found" });
                return;
            }
    
            const unavailability = await Unavailability.findOne({ developer: developerProfile._id });
            if (!unavailability) {
                res.json({ message: "No unavailability set" });
                return;
            }
    
            res.json({ unavailability });
            return;
        } else{
            const developerProfile = await DeveloperProfile.findOne({email: req.query.email});
            if (!developerProfile) {
                res.status(400).json({ message: "Developer not found" });
                return;
            }

            const unavailability = await Unavailability.findOne({ developer: developerProfile._id });
            if (!unavailability) {
                res.json({ message: "No unavailability set" });
                return;
            }

            res.json({ unavailability });
            return;
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
        return;
    }
}