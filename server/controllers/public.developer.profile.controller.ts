import { Request, Response } from "express";
import DeveloperProfile from "../models/DeveloperProfile.js";

export const  getDeveloperPublicProfileController = async(req: Request, res: Response)=>{
    const {email} = req.params;

    try {
        const developer = await DeveloperProfile.findOne({email}).select("-_id -__v -createdAt -updatedAt");
        if(!developer){
            res.status(404).json({message: "Developer not found"});
            return;
        }
        res.status(200).json(developer);
        return;
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Server Error"});
        return;
    }
}