// server/controllers/authController.ts
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import ClientProfile from "../models/ClientProfile.js";
import DeveloperProfile from "../models/DeveloperProfile.js";
import Joi from "joi";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Validation schemas
const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("developer", "client").required(),
  walletAddress: Joi.string().required(),
  name: Joi.string().required(),
  // Additional fields based on role
  hourlyRate: Joi.when("role", {
    is: "developer",
    then: Joi.number().required(),
  }),
  title: Joi.when("role", {
    is: "developer",
    then: Joi.string().required(),
  }),
  company: Joi.when("role", {
    is: "client",
    then: Joi.string().optional(),
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const signup = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const { error } = signupSchema.validate(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    const { email, password, role, walletAddress, name, ...profileData } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: "Email already registered" });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      email,
      password: hashedPassword,
      role,
      walletAddress,
    });
    await user.save();

    // Create profile based on role
    if (role === "developer") {
      const developerProfile = new DeveloperProfile({
        user: user._id,
        name,
        title: profileData.title,
        hourlyRate: profileData.hourlyRate,
        timezone: profileData.timezone || "UTC",
      });
      await developerProfile.save();
    } else {
      const clientProfile = new ClientProfile({
        user: user._id,
        name,
        company: profileData.company,
      });
      await clientProfile.save();
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id }, JWT_SECRET);

    res.status(201).json({ token, user: { email, role } });
  } catch (error) {
    res.status(500).json({ error: "Error creating user" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const { error } = loginSchema.validate(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT
    const token = jwt.sign({ id: user._id }, JWT_SECRET);

    res.json({ token, user: { email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: "Error during login" });
  }
};