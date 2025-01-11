import express, { Response } from "express";
import "dotenv/config.js";

import clientAuthRoute from "./routes/client.auth.js";
import developerAuthRoute from './routes/developer.auth.js';

const app = express();
app.use(express.json());

import "./connection.js";

// API Endpoints
app.get("/", (_, res: Response) => {
  res.send("Hello World");
});

app.use("/auth/client", clientAuthRoute);
app.use("/auth/developer", developerAuthRoute);

export default app;
