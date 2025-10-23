import express from "express";
import type { Express } from "express";

const app: Express = express();
const port: number = 1339; //PORT

// Middleware
app.use(express.json());
app.use(express.static("dist"));

//Endpoints
app.get("/ping", (req, res) => {
    res.status(200).json({ message: "pong" });
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}...`);
});
