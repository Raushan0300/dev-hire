import mongoose from "mongoose";

const developerSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  hourlyRate: {
    type: Number,
    required: true,
  },
  walletAddress: {
    type: String,
    required: true,
  },
});

const developerUser = mongoose.model("developerUser", developerSchema);
export default developerUser;
