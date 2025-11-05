import express from "express";
import type { Router, Request, Response } from "express";
import { db, tableName } from "../data/dynamoDb.js";
import { DeleteCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import jwt from "jsonwebtoken";
import type { UserItem } from "../data/types.js";
import { usersSchema } from "../data/validation.js";
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

        const user: UserItem = output.Items[0] as UserItem;

        res.send({
            username: user.username,
            userId: user.sk.substring(5),
        });
    }
);

interface Payload {
    userId: string;
    accessLevel: string;
}

router.delete(
    "/:userId",
    async (req: Request<UserIdParam>, res: Response<void>) => {
        const userIdToDelete: string = req.params.userId;

        // TODO: kontrollera om man är inloggad och har access
        // Steg 1: kontrollera att JWT följer med i headern
        // Steg 2: verifiera JWT -> få payload (som innehåller userId)
        //   - se till så payload innehåller accesslevel också
        // Steg 3: kontrollera att accessLevel är tillräcklig för det man vill göra
        // Steg 4: utför operationen eller svara med status 401
        // Detta behöver göras av flera endpoints - skapa en funktion

        const maybePayload: Payload | null = validateJwt(
            req.headers["authorization"]
        );
        if (!maybePayload) {
            console.log("Gick inte att validera JWT");
            res.sendStatus(401);
            return;
        }

        const { userId, accessLevel } = maybePayload;
        // Man får lov att ta bort en användare om man tar bort sig själv eller har accessLevel admin
        if (userId !== userIdToDelete && accessLevel !== "admin") {
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
            res.sendStatus(204); // lyckades ta bort
        } else {
            res.sendStatus(404);
        }
    }
);
export default router;
