import jwt from "jsonwebtoken";
import type { Payload } from "./types.js";
import { payloadSchema } from "./validation.js";

const jwtSecret: string = process.env.JWT_SECRET || "";

function createToken(
    userId: string,
    accessLevel: String,
    username: String
): string {
    const now = Math.floor(Date.now() / 1000);
    const defaultExpiration: number = now + 15 * 60;

    return jwt.sign(
        {
            userId: userId,
            username,
            accessLevel,
            exp: defaultExpiration,
        },
        jwtSecret
    );
}

export function validateJwt(authHeader: string | undefined): Payload | null {
    if (!authHeader) {
        return null;
    }

    const token = authHeader.substring(8);

    try {
        const decodedPayload = jwt.verify(token, process.env.JWT_SECRET || '')

        const parsed = payloadSchema.safeParse(decodedPayload);
        if (!parsed.success) {
            console.log("JWT is unacceptable", parsed.error);
            return null;
        }

        return parsed.data;
    } catch (error) {
        console.log('JWT verify failed: ', (error as any)?.message);
        return null;
    }
}

export { createToken };
