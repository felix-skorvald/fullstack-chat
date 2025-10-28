import express from "express";
import type { Express } from "express";
import userRouter from "./routes/users.js";
import registerRouter from "./routes/register.js";
import messageRouter from "./routes/messages.js";

const app: Express = express();
const port: number = Number(process.env.PORT) || 10000;

// Middleware
app.use(express.json());
app.use(express.static("dist"));

//Endpoints
app.use("/api/users", userRouter);
app.use("/api/register", registerRouter);
app.use("/api/message", messageRouter);
app.get("/ping", (req, res) => {
    res.status(200).json({ message: "pong" });
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}...`);
});
