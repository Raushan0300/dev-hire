import mongoose from "mongoose";

const developerSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true
  },

  email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,

  },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
   fullName:{
    type: String,
    required: true,
    trim: true,
    index: true
   },
    walletAddress: {
      type: String,
      required: true,
      unique: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    lastLogin: {
      type: Date,
    },
  },
  { timestamps: true }
);

const developerUser = mongoose.model("developerUser", developerSchema);
export default developerUser;