import express from "express";
import type { Router, Request, Response } from "express";
import { db, tableName } from "../data/dynamoDb.js";
import { DeleteCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import jwt from "jsonwebtoken";
import type { UserItem } from "../data/types.js";
import { usersSchema, userSchema } from "../data/validation.js";
import { validateJwt } from "../data/auth.js";

const router: Router = express.Router();

interface UserResponse {
    username: string;
    userId: string;
}
interface UserIdParam {
    userId: string;
}

router.get("/", async (req, res: Response<void | UserResponse[]>) => {
    const command = new QueryCommand({
        TableName: tableName,
        KeyConditionExpression: "pk = :value",
        ExpressionAttributeValues: {
            ":value": "USER",
        },
    });
    const output = await db.send(command);

    if (!output.Items) {
        res.status(500).send();
        return;
    }
    const users: UserItem[] = usersSchema.parse(output.Items);

    res.send(
        users.map((ui) => ({
            username: ui.username,
            userId: ui.sk.substring(5),
        }))
    );
});

router.get(
    "/:userId",
    async (req: Request<UserIdParam>, res: Response<void | UserResponse>) => {
        const userId = req.params.userId;
        const sk = `USER#${userId}`;

        const command = new QueryCommand({
            TableName: tableName,
            KeyConditionExpression: "pk = :pk AND sk = :sk",
            ExpressionAttributeValues: {
                ":pk": "USER",
                ":sk": sk,
            },
            Limit: 1,
        });

        const output = await db.send(command);

        if (!output.Items || output.Items.length === 0) {
            res.sendStatus(404);
            return;
        }

        const parsedUser = userSchema.parse(output.Items[0]);

        const user: UserItem = parsedUser;

        res.send({
            username: user.username,
            userId: user.sk.substring(5),
        });
    }
);

interface Payload {
    userId: string;
    accessLevel: string;
    username: string;
}

router.delete(
    "/:userId",
    async (req: Request<UserIdParam>, res: Response<void>) => {
        const userIdToDelete: string = req.params.userId;

        const maybePayload: Payload | null = validateJwt(
            req.headers["authorization"]
        );

        if (!maybePayload) {
            console.log("Gick inte att validera JWT");
            res.sendStatus(401);
            return;
        }

        const { userId, accessLevel } = maybePayload;

        if (userId !== userIdToDelete) {
            console.log("Inte tillräcklig access level. ", userId, accessLevel);
            res.sendStatus(401);
            return;
        }

        const command = new DeleteCommand({
            TableName: tableName,
            Key: {
                pk: "USER",
                sk: "USER#" + userIdToDelete,
            },
            ReturnValues: "ALL_OLD",
        });
        const output = await db.send(command);
        if (output.Attributes) {
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }
    }
);
export default router;
