import express from "express";
import {
    DeleteCommand,
    GetCommand,
    PutCommand,
    QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { db, tableName } from "../data/dynamoDb.js";
import type { Response, Request, Router } from "express";
import {
    newChannelSchema,
    channelsSchema,
    type NewChannel,
    type Channel,
    payloadSchema,
} from "../data/validation.js";
import z from "zod";
import { validateJwt } from "../data/auth.js";
import type { ChannelResponse, Payload } from "../data/types.js";

const router: Router = express.Router();

router.get("/", async (req, res: Response<ChannelResponse[] | string>) => {
    try {
        const command = new QueryCommand({
            TableName: tableName,
            KeyConditionExpression: "pk = :value",
            ExpressionAttributeValues: {
                ":value": "CHANNEL",
            },
        });
        const output = await db.send(command);

        if (!output.Items) {
            res.status(500).send();
            return;
        }

        const channels: ChannelResponse[] = channelsSchema.parse(output.Items);
        res.send(
            channels.map((ch) => ({
                channelName: ch.channelName,
                channelId: ch.channelId,
                createdBy: ch.createdBy,
                isPrivate: ch.isPrivate,
            }))
        );
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).send("The content requested is broken");
        }

        res.status(500).send("error i server");
    }
});

router.get(
    "/:channelId",
    async (req, res: Response<ChannelResponse | string>) => {
        try {
            const { channelId } = req.params;

            if (!channelId) {
                return res.status(400).send("Channel ID is required");
            }

            const getCommand = new GetCommand({
                TableName: tableName,
                Key: {
                    pk: "CHANNEL",
                    sk: "CHANNEL#" + channelId,
                },
            });

            const channelOutput = await db.send(getCommand);

            if (!channelOutput.Item) {
                return res.status(404).send("Channel not found");
            }

            const channel = channelsSchema.parse([channelOutput.Item])[0];
            res.send(channel);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).send("The content requested is broken");
            }

            console.error("Error fetching channel:", error);
            res.status(500).send("Server error");
        }
    }
);

router.post(
    "/",
    async (
        req: Request<{}, Channel, NewChannel>,
        res: Response<Channel | string>
    ) => {
        try {
            const body: NewChannel = newChannelSchema.parse(req.body);
            const newId = crypto.randomUUID();

            const channel = {
                channelName: body.channelName,
                createdBy: body.createdBy,
                isPrivate: body.isPrivate,
                pk: "CHANNEL",
                sk: "CHANNEL#" + newId,
                channelId: newId,
            };

            await db.send(
                new PutCommand({
                    TableName: tableName,
                    Item: channel,
                })
            );

            res.status(201).send(channel);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).send("Invalid input");
            }
            console.error("Error creating channel:", error);
            res.status(500).send("Server error");
        }
    }
);

router.delete("/:channelId", async (req: Request, res: Response<string>) => {
    try {
        const maybePayload: Payload | null = validateJwt(
            req.headers["authorization"]
        );

        if (!maybePayload) {
            return res.status(401).send("Unauthorized");
        }

        const payload = payloadSchema.parse(maybePayload);
        const { channelId } = req.params;

        if (!channelId) {
            return res.status(400).send("Channel ID is required");
        }

        const getCommand = new GetCommand({
            TableName: tableName,
            Key: {
                pk: "CHANNEL",
                sk: "CHANNEL#" + channelId,
            },
        });

        const channelOutput = await db.send(getCommand);

        if (!channelOutput.Item) {
            return res.status(404).send("Channel not found");
        }

        if (channelOutput.Item.createdBy !== payload.userId) {
            return res
                .status(403)
                .send("You can only delete channels you created");
        }

        const deleteCommand = new DeleteCommand({
            TableName: tableName,
            Key: {
                pk: "CHANNEL",
                sk: "CHANNEL#" + channelId,
            },
        });

        await db.send(deleteCommand);
        res.status(200).send("Channel deleted successfully");
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).send("Invalid token payload");
        }
        console.error("Error deleting channel:", error);
        res.status(500).send("Server error");
    }
});

export default router;
