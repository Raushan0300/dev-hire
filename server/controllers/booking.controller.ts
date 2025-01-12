import { Request, Response } from "express";
import Booking from "../models/Booking.js";
import ClientProfile from "../models/ClientProfile.js";
import DeveloperProfile from "../models/DeveloperProfile.js";
// import { ethers } from "ethers";
// import BookingContract from "../contracts/DevHireBooking.json";

// const CONTRACT_ADDRESS = process.env.BOOKING_CONTRACT_ADDRESS;

export const createBookingController = async (req: Request, res: Response) => {
  const { id: clientId, role } = req.body?.user;
  const { 
    developerEmail, 
    startTime, 
    duration, 
    amount,
    transactionHash,
    notes 
  } = req.body;

  try {
    if (role !== "client") {
      res.status(400).json({ message: "Not authorized" });
      return;
    }

    const client = await ClientProfile.findOne({ user: clientId });
    const developer = await DeveloperProfile.findOne({ email: developerEmail });

    if (!client || !developer) {
      res.status(404).json({ message: "Profile not found" });
      return;
    }

    const booking = new Booking({
      client: client._id,
      developer: developer._id,
      startTime: new Date(startTime),
      duration,
      amount,
      transactionHash,
      notes,
      status: "pending",
      paymentStatus: "pending"
    });

    await booking.save();

    res.status(201).json({ booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};