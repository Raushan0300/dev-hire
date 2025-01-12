import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const isAuth = (req:Request, res:Response, next:NextFunction)=>{
    const token = req.headers["authorization"];

    if(!token){
        res.status(401).json({message:"No token, authorization denied"});
        return;
    }

    try {
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined");
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.body.user = decoded;
        next();
    } catch (error) {
        res.status(501).json({message:"Token is not valid"});
    }
};