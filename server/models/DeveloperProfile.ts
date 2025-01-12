import mongoose from "mongoose";

const developerProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
    },
    skills: [
      {
        type: String,
      },
    ],
    hourlyRate: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      type: String,
    },
    timezone: String,
    languages: [
      {
        type: String,
      },
    ],
    github: String,
    yearsOfExperience: Number,
    availability: {
      type: String,
      enum: ["Online", "Busy", "Away", "Offline"],
      default: "Online",
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    totalEarnings: {
      type: Number,
      default: 0,
    },
    completedCalls: {
      type: Number,
      default: 0,
    },
    responseRate: {
      type: Number,
      default: 100,
    },
  },
  { timestamps: true }
);

const DeveloperProfile = mongoose.model(
  "DeveloperProfile",
  developerProfileSchema
);
export default DeveloperProfile;
