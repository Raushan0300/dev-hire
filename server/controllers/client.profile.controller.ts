import { Request, Response } from "express";
import ClientProfile from "../models/ClientProfile.js";
import DeveloperProfile from "../models/DeveloperProfile.js";

export const clientProfileController = async(req: Request, res: Response)=>{
    const {id, role} =req.body?.user;
    try {
        if(role !== "client"){
            res.status(400).json({message:"You are not a client"});
            return;
        }

        const clientProfile = await ClientProfile.findOne({ user: id }).select("-user -_id -__v");
        if (!clientProfile) {
            res.status(404).json({ message: "Client Profile not found" });
            return;
        }
        res.status(200).json(clientProfile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
        return;
    }
}

export const availableDevelopersController = async(req: Request, res: Response)=>{
    const {role} = req.body?.user;
    try {
        if(role !== "client"){
            res.status(400).json({message:"You are not a client"});
            return;
        }

        const developers = await DeveloperProfile.find({availability: "Online"}).select("-user -_id -__v");
        res.status(200).json(developers);
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
        return;
    }
}