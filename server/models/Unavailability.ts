import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema({
  developer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DeveloperProfile",
    required: true,
  },
  timeSlots: [{
    date: {
      type: Date,
      required: true,
    },
    time: [{
      type: String,
      required: true,
    }],
  }]
}, { timestamps: true });

const Unavailability = mongoose.model("Unavailability", availabilitySchema);
export default Unavailability;