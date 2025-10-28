import { PutCommand } from "@aws-sdk/lib-dynamodb";
import express from "express";
import type { Router, Request, Response } from "express";
import { db, tableName } from "../data/dynamoDb.js";
import { createToken } from "../data/auth.js";
import type { JwtResponse, UserBody } from "../data/types.js";
import { genSalt, hash } from "bcrypt";

const router: Router = express.Router();

router.post(
    "/",
    async (
        req: Request<{}, JwtResponse, UserBody>,
        res: Response<JwtResponse>
    ) => {
        //ZOD
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
        });
        try {
            const result = await db.send(command);
            const token: string | null = createToken(newId, "user");
            res.send({ success: true, token: token });
        } catch (error) {
            console.log(`register.ts fel:`, (error as any)?.message);
            res.status(500).send({ success: false });
        }
    }
);

export default router;
