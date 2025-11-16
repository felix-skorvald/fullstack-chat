import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import express from "express";
import type { Router, Request, Response } from "express";
import { db, tableName } from "../data/dynamoDb.js";
import type { SendMessageBody, Message, Payload } from "../data/types.js";
import {
    messagesSchema,
    payloadSchema,
    sendMessageSchema,
} from "../data/validation.js";
import { validateJwt } from "../data/auth.js";
import z from "zod";

const router: Router = express.Router();

router.post(
    "/",
    async (
        req: Request<{}, Message, SendMessageBody>,
        res: Response<Message | string>
    ) => {
        try {
            const body: SendMessageBody = sendMessageSchema.parse(req.body);

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

            await db.send(command);
            res.send(message);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).send("Invalid message data");
            }
            console.error("Error sending message:", error);
            res.status(500).send("Server error");
        }
    }
);

router.get(
    "/channel/:idParam",
    async (
        req: Request<{ idParam: string }>,
        res: Response<Message[] | string>
    ) => {
        try {
            const receiverId = req.params.idParam;

            const params = {
                TableName: tableName,
                KeyConditionExpression:
                    "pk = :pk AND begins_with(sk, :skPrefix)",
                ExpressionAttributeValues: {
                    ":pk": "MESSAGE",
                    ":skPrefix": `RID#${receiverId}`,
                },
            };

            const result = await db.send(new QueryCommand(params));

            if (!result.Items) {
                return res.send([]);
            }

            const messages = messagesSchema.parse(result.Items);

            res.send(messages);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res
                    .status(500)
                    .send("Invalid data format from database");
            }
            console.error("Error fetching channel messages:", error);
            res.status(500).send("Server error");
        }
    }
);

router.get(
    "/user/:idParam",
    async (
        req: Request<{ idParam: string }>,
        res: Response<Message[] | string>
    ) => {
        try {
            const receiverId = req.params.idParam;

            const maybePayload: Payload | null = validateJwt(
                req.headers["authorization"]
            );

            if (!maybePayload) {
                return res.status(401).send("Unauthorized");
            }

            const payload = payloadSchema.parse(maybePayload);
            const myId = payload.userId;

            const params1 = {
                TableName: tableName,
                KeyConditionExpression:
                    "pk = :pk AND begins_with(sk, :skPrefix1)",
                ExpressionAttributeValues: {
                    ":pk": "MESSAGE",
                    ":skPrefix1": `RID#${receiverId}#SID#${myId}`,
                },
            };

            const params2 = {
                TableName: tableName,
                KeyConditionExpression:
                    "pk = :pk AND begins_with(sk, :skPrefix2)",
                ExpressionAttributeValues: {
                    ":pk": "MESSAGE",
                    ":skPrefix2": `RID#${myId}#SID#${receiverId}`,
                },
            };

            const [result1, result2] = await Promise.all([
                db.send(new QueryCommand(params1)),
                db.send(new QueryCommand(params2)),
            ]);

            const allMessages = [
                ...(result1.Items || []),
                ...(result2.Items || []),
            ];

            allMessages.sort((a, b) =>
                a.sk.localeCompare(b.sk, "en", { sensitivity: "base" })
            );

            const messages = messagesSchema.parse(allMessages);

            res.send(messages);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).send("Invalid data format");
            }
            console.error("Error fetching user messages:", error);
            res.status(500).send("Server error");
        }
    }
);

export default router;
