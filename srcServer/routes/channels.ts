// användaren som sakpat ska kunna ta bort
import express from "express";
import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { db, tableName } from "../data/dynamoDb.js";
import type { Response, Request, Router } from "express";
import {
    newChannel,
    type NewChannel,
    type Channel,
} from "../data/validation.js";

interface ChannelResponse {
    channelName: string;
    channelId: string;
    createdBy: string;
    isPrivate: boolean;
}

const router: Router = express.Router();

router.get("/", async (req, res: Response<ChannelResponse[]>) => {
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

    const channels: ChannelResponse[] = output.Items as ChannelResponse[];
    console.log(channels);
    res.send(
        channels.map((ch) => ({
            channelName: ch.channelName,
            channelId: ch.channelId,
            createdBy: ch.createdBy,
            isPrivate: ch.isPrivate,
        }))
    );
});

router.post(
    "/",
    async (
        req: Request<{}, Channel, NewChannel>,
        res: Response<Channel | string>
    ) => {
        //ZOD
        const body: NewChannel = req.body;
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

        try {
            const result = await db.send(command);
            res.send(channel);
        } catch (error) {
            console.log(`FEl med meddelande:`, (error as any)?.message);
            res.status(500).send("error i server");
        }
    }
);

export default router;
