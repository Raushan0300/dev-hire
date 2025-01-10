import express, { Response } from "express";

const app = express();

// API Endpoints
app.get("/", (_, res: Response) => {
  res.send("Hello World");
});

export default app;
