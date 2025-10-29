import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import express from "express";
import type { Router, Request, Response } from "express";
import { db, tableName } from "../data/dynamoDb.js";
import { createToken } from "../data/auth.js";
import type { SendMessageBody, Message } from "../data/types.js";
import { messageSchema, messagesSchema } from "../data/validation.js";

const router: Router = express.Router();

interface IdParam {
    id: string;
}

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
            "RID#" +
            body.receiverId +
            "#SID#" +
            body.senderId +
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
            messageId: newId,
        };

        const command = new PutCommand({
            TableName: tableName,
            Item: message,
        });
        try {
            const result = await db.send(command);
            res.send(message);
        } catch (error) {
            console.log(`FEl med meddelande:`, (error as any)?.message);
            res.status(500).send("error i server");
        }
    }
);

// router.get(
//     "user/:id",
//     async (req: Request<IdParam>, res: Response<Message[] | string>) => {
//         getDMs()
//     }

router.get(
    "/channel/:idParam",
    async (req: Request<{ idParam: string }>, res: Response) => {
        const receiverId = req.params.idParam;
        // Autetnisera if is private??
        const params = {
            TableName: tableName,
            KeyConditionExpression: "pk = :pk AND begins_with(sk, :skPrefix)",
            ExpressionAttributeValues: {
                ":pk": "MESSAGE",
                ":skPrefix": `RID#${receiverId}`,
            },
        };

        try {
            const result = await db.send(new QueryCommand(params));
            res.send(result.Items || []);
        } catch (error) {
            console.log("GET channel fel:", (error as any)?.message);
            res.status(500).send("Error i servern");
        }
    }
);

export default router;
