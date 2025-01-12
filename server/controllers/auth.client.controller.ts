import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import clientUser from "../models/Client.js";
import ClientProfile from "../models/ClientProfile.js";

export const clientSignupController = async (req: Request, res: Response) => {
  const { email, password, fullName, company } = req.body;

  if (!email || !password || !fullName) {
    res.status(400).json({ message: "Please enter all fields" });
    return;
  }

  try {
    const client = await clientUser.findOne({ email });
    if (client) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const newClient = new clientUser({
      email,
      password: hash,
      fullName,
      company,
    });
    await newClient.save();

    const newClientProfile = new ClientProfile({
      user: newClient._id,
      email,
      fullName,
      company,
    })

    await newClientProfile.save();

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }
    const token = jwt.sign({ id: newClient._id, role: "client" }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({
      token,
      client: {
        email: newClient.email,
        fullName: newClient.fullName,
        company: newClient.company,
      },
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
    return;
  }
};

export const clientLoginController = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        res.status(400).json({ message: "Please enter all fields" });
        return;
    }
    
    try {
        const client = await clientUser.findOne({ email });
        if (!client) {
        res.status(400).json({ message: "User does not exist" });
        return;
        }
    
        const isMatch = await bcrypt.compare(password, client.password);
        if (!isMatch) {
        res.status(400).json({ message: "Invalid credentials" });
        return;
        }
    
        if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
        }
        const token = jwt.sign({ id: client._id, role:"client" }, process.env.JWT_SECRET, {
        expiresIn: "7d",
        });
        res.json({
        token,
        client: {
            email: client.email,
            fullName: client.fullName,
            company: client.company,
        },
        });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
        return;
    }
};