import mongoose from "mongoose";

const clientProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    company: String,
    image: String,
    timezone: String,
    totalSpent: {
      type: Number,
      default: 0,
    },
    completedCalls: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const ClientProfile = mongoose.model("ClientProfile", clientProfileSchema);
export default ClientProfile;
