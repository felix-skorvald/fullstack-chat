import express from "express";
import type { Express } from "express";
import userRouter from "./routes/users.js";
import registerRouter from "./routes/register.js";
import messageRouter from "./routes/messages.js";
import channelRouter from "./routes/channels.js";

const app: Express = express();
const port: number = Number(process.env.PORT) || 10000;

// Middleware
app.use(express.json());
app.use(express.static("dist"));

//Endpoints
app.use("/api/users", userRouter);
app.use("/api/register", registerRouter);
app.use("/api/message", messageRouter);
app.use("/api/channel", channelRouter);

app.listen(port, () => {
    console.log(`Server is listening on port ${port}...`);
});
