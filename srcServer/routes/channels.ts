// användaren som sakpat ska kunna ta bort
import express from "express";
import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { db, tableName } from "../data/dynamoDb.js";
import type { Response, Request, Router } from "express";
import {
    newChannelSchema,
    channelsSchema,
    type NewChannel,
    type Channel,
} from "../data/validation.js";
import z from "zod";

interface ChannelResponse {
    channelName: string;
    channelId: string;
    createdBy: string;
    isPrivate: boolean;
}

const router: Router = express.Router();

router.get("/", async (req, res: Response<ChannelResponse[] | String>) => {
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
        console.log(channels);
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

router.post(
    "/",
    async (
        req: Request<{}, Channel, NewChannel>,
        res: Response<Channel | string>
    ) => {
        try {
            const newChannelInput: NewChannel = req.body;

            const body: NewChannel = newChannelSchema.parse(newChannelInput);

            console.log("body", body);

            const newId = crypto.randomUUID();

            const channel = {
                channelName: body.channelName,
                createdBy: body.createdBy,
                isPrivate: body.isPrivate,
                pk: "CHANNEL",
                sk: "CHANNEL#" + newId,
                channelId: newId,
            };

            const command = new PutCommand({
                TableName: tableName,
                Item: channel,
            });

            const result = await db.send(command);
            res.send(channel);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).send("Input did not pass validation");
            }

            res.status(500).send("error i server");
        }
    }
);

export default router;
