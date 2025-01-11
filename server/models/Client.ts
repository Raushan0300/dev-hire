import mongoose from "mongoose";
import bcrypt from "bcrypt"

const clientSchema = new mongoose.Schema(
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

clientSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
})

const clientUser = mongoose.model("clientUser", clientSchema);
export default clientUser;