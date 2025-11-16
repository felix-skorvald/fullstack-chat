import express from "express";
import type { Router, Request, Response } from "express";
import { createToken } from "../data/auth.js";
import type { JwtResponse, UserBody, UserItem } from "../data/types.js";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { db, tableName } from "../data/dynamoDb.js";
import { compare } from "bcrypt";
import { signInSchema, usersSchema } from "../data/validation.js";
import type { ErrorResponse } from "../data/types.js";
import z from "zod";

const router: Router = express.Router();

router.post(
    "/",
    async (
        req: Request<{}, JwtResponse | ErrorResponse, UserBody>,
        res: Response<JwtResponse | ErrorResponse>
    ) => {
        try {
            const body: UserBody = signInSchema.parse(req.body);
            console.log("body", body);

            const command = new QueryCommand({
                TableName: tableName,
                KeyConditionExpression: "pk = :value",
                ExpressionAttributeValues: {
                    ":value": "USER",
                },
            });
            const output = await db.send(command);
            if (!output.Items) {
                res.sendStatus(404);
                return;
            }

            const users: UserItem[] = usersSchema.parse(output.Items);
            const found: UserItem | undefined = users.find(
                (user) => user.username === body.username
            );
            if (!found) {
                res.sendStatus(401);
                return;
            }

            const passwordMatch: boolean = await compare(
                body.password,
                found.passwordHash
            );
            if (!passwordMatch) {
                res.sendStatus(401);
                return;
            }
            const token: string = createToken(
                found.sk.substring(5),
                found.accessLevel,
                found.username
            );
            res.send({ success: true, token: token });
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    success: false,
                    message: "Validation failed",
                });
            }
        }
    }
);

export default router;
