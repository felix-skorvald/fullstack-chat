import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import express from "express";
import type { Router, Request, Response } from "express";
import { db, tableName } from "../data/dynamoDb.js";
import { createToken } from "../data/auth.js";
import type { JwtResponse, UserBody, ErrorResponse, UserItem } from "../data/types.js";
import { genSalt, hash } from "bcrypt";
import z from "zod";
import { signInSchema, usersSchema } from "../data/validation.js";


const router: Router = express.Router();

router.post(
    "/",
    async (
        req: Request<{}, JwtResponse, UserBody>,
        res: Response<JwtResponse | ErrorResponse>
    ) => {
        try {
            const body: UserBody = signInSchema.parse(req.body);
            console.log("body", body);

            const allUsersCommand = new QueryCommand({
                TableName: tableName,
                KeyConditionExpression: "pk = :value",
                ExpressionAttributeValues: {
                    ":value": "USER",
                },
            });

            const allUsersResult = await db.send(allUsersCommand);
            const users: UserItem[] = usersSchema.parse(allUsersResult.Items ?? []);

            const usernameTaken = users.some(
                (u) => u.username.toLowerCase() === body.username.toLowerCase()
            );

            if (usernameTaken) {
                return res.status(400).json({
                    success: false,
                    message: "Användarnamnet är redan upptaget",
                });
            }

            const newId = crypto.randomUUID();

            const salt: string = await genSalt();
            const hashed: string = await hash(body.password, salt);

            const command = new PutCommand({
                TableName: tableName,
                Item: {
                    username: body.username,
                    passwordHash: hashed,
                    accessLevel: "user",
                    userId: newId,
                    pk: "USER",
                    sk: "USER#" + newId,
                },
            });

            await db.send(command);

            const token: string | null = createToken(
                newId,
                "user",
                body.username
            );

            res.send({ success: true, token });
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    success: false,
                    message: "Validation failed",
                });
            }

            res.status(500).send({ success: false });
        }
    }
);

export default router;
