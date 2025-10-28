import { db } from "../data/dynamoDb.js";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";

async function getChannelMessages(channelId: string) {
    const command = new QueryCommand({
        TableName: "Chappy",
        KeyConditionExpression: "pk = :pk AND begins_with(sk, :skPrefix)",
        ExpressionAttributeValues: {
            ":pk": "MESSAGE",
            ":skPrefix": `MESSAGE#` + `#RIV#USER#${channelId}`,
        },
        ScanIndexForward: true,
    });

    const res = await db.send(command);
    return res.Items ?? [];
}

async function getDMs(userA: string, userB: string) {
    const command = new QueryCommand({
        TableName: "Chappy",
        KeyConditionExpression: "pk = :pk",
        FilterExpression:
            "(senderId = :userA AND receiverId = :userB) OR (senderId = :userB AND receiverId = :userA)",
        ExpressionAttributeValues: {
            ":pk": { S: "MESSAGE" },
            ":userA": { S: userA },
            ":userB": { S: userB },
        },
        ScanIndexForward: true,
    });

    const res = await db.send(command);
    return res.Items;
}

export { getDMs, getChannelMessages };
