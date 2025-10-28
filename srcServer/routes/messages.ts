import { PutCommand } from "@aws-sdk/lib-dynamodb";
import express from "express";
import type { Router, Request, Response } from "express";
import { db, tableName } from "../data/dynamoDb.js";
import { createToken } from "../data/auth.js";
import type { SendMessageBody, Message } from "../data/types.js";

const router: Router = express.Router();

router.post(
    "/",
    async (
        req: Request<{}, Message, SendMessageBody>,
        res: Response<Message | string>
    ) => {
        //ZOD
        const body: SendMessageBody = req.body;
        console.log("body", body);

        const newId = crypto.randomUUID();
        const now = new Date();
        const timeKey = now
            .toISOString()
            .replace(/[-:.TZ]/g, "")
            .slice(0, 14);
        const timestamp = now.toISOString();

        const newSk =
            "MESSAGE#" +
            newId +
            "#SID#USER#" +
            body.senderId +
            "#RIV#USER#" +
            body.receiverId +
            "#TIME#" +
            timeKey;

        const message = {
            senderId: body.senderId,
            receiverId: body.receiverId,
            senderName: body.senderName,
            message: body.message,
            timestamp: timestamp,
            pk: "MESSAGE",
            sk: newSk,
        };

        const command = new PutCommand({
            TableName: tableName,
            Item: message,
        });
        try {
            const result = await db.send(command);
            const token: string | null = createToken(newId, "user");
            res.send(message);
        } catch (error) {
            console.log(`register.ts fel:`, (error as any)?.message);
            res.status(500).send("error i server");
        }
    }
);

export default router;
