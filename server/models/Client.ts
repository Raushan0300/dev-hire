import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
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
  company: {
    type: String,
  }
});

const clientUser = mongoose.model("clientUser", clientSchema);
export default clientUser;
