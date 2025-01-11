import { Request, Response } from "express";
import DeveloperProfile from "../models/DeveloperProfile.js";
import Booking from "../models/Booking.js";
import Availability from "../models/Availability.js";

interface AuthRequest extends Request {
  user?: any;
}

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const profile = await DeveloperProfile.findOne({ 
      user: req.user._id 
    });
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: "Error fetching profile" });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { name, title, bio, hourlyRate, timezone, skills } = req.body;
    
    const profile = await DeveloperProfile.findOneAndUpdate(
      { user: req.user._id },
      { 
        name, 
        title, 
        bio, 
        hourlyRate, 
        timezone,
        skills: skills.split(',').map((skill: string) => skill.trim()),
      },
      { new: true }
    );

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: "Error updating profile" });
  }
};

export const updateAvailability = async (req: AuthRequest, res: Response) => {
  try {
    const { date, timeSlots } = req.body;

    const availability = await Availability.findOneAndUpdate(
      { 
        developer: req.user._id,
        date: new Date(date)
      },
      { timeSlots },
      { new: true, upsert: true }
    );

    res.json(availability);
  } catch (error) {
    res.status(500).json({ error: "Error updating availability" });
  }
};

export const getBookings = async (req: AuthRequest, res: Response) => {
  try {
    const bookings = await Booking.find({ 
      developer: req.user._id 
    })
    .populate('client')
    .sort({ startTime: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Error fetching bookings" });
  }
};