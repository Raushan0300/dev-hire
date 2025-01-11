import { Request, Response } from "express";
import ClientProfile from "../models/ClientProfile.js";
import DeveloperProfile from "../models/DeveloperProfile.js";
import Booking from "../models/Booking.js";

interface AuthRequest extends Request {
  user?: any;
}

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const profile = await ClientProfile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: "Error fetching profile" });
  }
};

export const getAvailableDevelopers = async (_: Request, res: Response) => {
  try {
    const developers = await DeveloperProfile.find({ 
      availability: "Available" 
    }).populate('user', 'email');
    res.json(developers);
  } catch (error) {
    res.status(500).json({ error: "Error fetching developers" });
  }
};

export const getBookings = async (req: AuthRequest, res: Response) => {
  try {
    const bookings = await Booking.find({ 
      client: req.user._id 
    })
    .populate('developer')
    .sort({ startTime: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Error fetching bookings" });
  }
};