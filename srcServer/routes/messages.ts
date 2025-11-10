import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import express from "express";
import type { Router, Request, Response } from "express";
import { db, tableName } from "../data/dynamoDb.js";
import type { SendMessageBody, Message, Payload } from "../data/types.js";
import { messageSchema, messagesSchema } from "../data/validation.js";
import { validateJwt } from "../data/auth.js";

const router: Router = express.Router();

const jwtSecret: string = process.env.JWT_SECRET || "";

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

router.get(
    "/user/:idParam",
    async (req: Request<{ idParam: string }>, res: Response) => {
        const receiverId = req.params.idParam;
        const authHeader = req.header("authorization");

        if (!authHeader) {
            return res.status(401).send("Missing Authorization header");
        }
        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).send("Invalid Authorization header format");
        }

        try {
            const maybePayload: Payload | null = validateJwt(
                req.headers["authorization"]
            );
            if (!maybePayload) {
                console.log("Gick inte att validera JWT");
                res.sendStatus(401);
                return;
            }

            const myId = maybePayload.userId;
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

            const parsed = messagesSchema.safeParse(allMessages);
            //Kör med z zoderror sen
            if (!parsed.success) {
                return res
                    .status(500)
                    .send("Felaktigt meddelandeformat i databasen");
            }

            res.send(parsed.data);
        } catch (error) {
            if ((error as any).name === "JsonWebTokenError") {
                return res.status(401).send("Invalid token");
            }

            res.status(500).send("Error i servern");
        }
    }
);

export default router;
