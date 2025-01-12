import express, { Response } from "express";
import "dotenv/config.js";

import clientAuthRoute from "./routes/client.auth.js";
import developerAuthRoute from './routes/developer.auth.js';
import developerRoute from './routes/developer.route.js';

import clientRoute from './routes/client.route.js';

import developerPublicProfileRoute from './routes/public.developer.profile.js';

import bookingRoute from './routes/booking.route.js';

const app = express();
app.use(express.json());

import "./connection.js";

// API Endpoints
app.get("/", (_, res: Response) => {
  res.send("Hello World");
});

app.use("/auth/client", clientAuthRoute);
app.use("/auth/developer", developerAuthRoute);
app.use("/developer", developerRoute);
app.use("/client", clientRoute);
app.use("/public", developerPublicProfileRoute);

app.use("/booking", bookingRoute);


export default app;
