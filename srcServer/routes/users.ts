import express from "express";
import type { Router, Request, Response } from "express";
import { db, tableName } from "../data/dynamoDb.js";
import { DeleteCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import type {
    Payload,
    UserIdParam,
    UserItem,
    UserResponse,
} from "../data/types.js";
import { usersSchema, userSchema, payloadSchema } from "../data/validation.js";
import { validateJwt } from "../data/auth.js";
import z from "zod";

const router: Router = express.Router();

router.get("/", async (req, res: Response<string | UserResponse[]>) => {
    try {
        const command = new QueryCommand({
            TableName: tableName,
            KeyConditionExpression: "pk = :value",
            ExpressionAttributeValues: {
                ":value": "USER",
            },
        });
        const output = await db.send(command);

        if (!output.Items) {
            return res.status(404).send("No users found");
        }

        const users: UserItem[] = usersSchema.parse(output.Items);

        res.send(
            users.map((ui) => ({
                username: ui.username,
                userId: ui.sk.substring(5),
            }))
        );
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(500).send("Invalid data format from database");
        }
        console.error("Error fetching users:", error);
        res.status(500).send("Server error");
    }
});

router.get(
    "/:userId",
    async (req: Request<UserIdParam>, res: Response<string | UserResponse>) => {
        try {
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
                return res.status(404).send("User not found");
            }

            const parsedUser = userSchema.parse(output.Items[0]);

            const user: UserItem = parsedUser;

            res.send({
                username: user.username,
                userId: user.sk.substring(5),
            });
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res
                    .status(500)
                    .send("Invalid data format from database");
            }
            console.error("Error fetching user:", error);
            res.status(500).send("Server error");
        }
    }
);

router.delete(
    "/:userId",
    async (req: Request<UserIdParam>, res: Response<string>) => {
        try {
            const userIdToDelete: string = req.params.userId;

            const maybePayload: Payload | null = validateJwt(
                req.headers["authorization"]
            );

            if (!maybePayload) {
                return res.status(401).send("Unauthorized");
            }

            const payload = payloadSchema.parse(maybePayload);
            const { userId } = payload;

            if (userId !== userIdToDelete) {
                return res
                    .status(403)
                    .send("You can only delete your own account");
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
                return res.status(200).send("User deleted successfully");
            } else {
                res.status(404).send("User not found");
            }
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).send("Invalid token payload");
            }
            console.error("Error deleting user:", error);
            res.status(500).send("Server error");
        }
    }
);

export default router;
