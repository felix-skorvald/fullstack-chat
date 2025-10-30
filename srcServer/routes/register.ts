import { PutCommand } from "@aws-sdk/lib-dynamodb";
import express from "express";
import type { Router, Request, Response } from "express";
import { db, tableName } from "../data/dynamoDb.js";
import { createToken } from "../data/auth.js";
import type { JwtResponse, UserBody, ErrorResponse } from "../data/types.js";
import { genSalt, hash } from "bcrypt";
import z from "zod";
import { signInSchema } from "../data/validation.js";

const router: Router = express.Router();

router.post(
    "/",
    async (
        req: Request<{}, JwtResponse, UserBody>,
        res: Response<JwtResponse | ErrorResponse>
    ) => {
        const body: UserBody = req.body;
        console.log("body", body);

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
            //ZOD
        });
        try {
            const result = await db.send(command);
            const token: string | null = createToken(
                newId,
                "user",
                body.username
            );
            res.send({ success: true, token: token });
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    success: false,
                    message: "Validation failed",
                });
            }
            console.log(`register.ts fel:`, (error as any)?.message);

            res.status(500).send({ success: false });
        }
    }
);

export default router;
