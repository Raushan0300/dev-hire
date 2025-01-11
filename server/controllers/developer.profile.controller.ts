import { Request, Response } from 'express';
import DeveloperProfile from '../models/DeveloperProfile.js';
export const developerProfileController = async (req: Request, res: Response) => {
    const {id, role} =req.body?.user;
    try{
        if(role !== "developer"){
            res.status(400).json({message:"You are not a developer"});
            return;
        }
        const developerProfile = await DeveloperProfile.findOne({ user: id }).select("-user -_id -__v");
        if (!developerProfile) {
            res.status(400).json({ message: "Developer not found" });
            return;
        }
        res.json(developerProfile);
        return;
    }catch(error){
        console.error(error);
        res.status(500).json({ message: "Server Error" });
        return;
    }

};

export const updateDeveloperProfileController = async (req: Request, res: Response) => {
    const {id, role} =req.body?.user;
    const {hourlyRate,fullName,skills, bio, title} = req.body;
    try{
        if(role !== "developer"){
            res.status(400).json({message:"You are not a developer"});
            return;
        }
        const developerProfile = await DeveloperProfile.findOne({ user: id });
        if (!developerProfile) {
            res.status(400).json({ message: "Developer not found" });
            return;
        }
        developerProfile.skills = skills;
        developerProfile.bio = bio;
        developerProfile.title = title;
        developerProfile.fullName = fullName;
        developerProfile.hourlyRate = hourlyRate;
        await developerProfile.save();
        res.json({ message: "Profile updated" });
        return;
    }catch(error){
        console.error(error);
        res.status(500).json({ message: "Server Error" });
        return;
    }
};

