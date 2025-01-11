import express, { Response } from "express";
import authRoutes from "./routes/auth.js";

const app = express();
app.use(express.json());

import "./connection.js";

// API Endpoints
app.get("/", (_, res: Response) => {
  res.send("Hello World");
});

app.use("/auth", authRoutes);

export default app;
