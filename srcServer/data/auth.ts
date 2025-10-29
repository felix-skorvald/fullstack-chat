import jwt from "jsonwebtoken";

const jwtSecret: string = process.env.JWT_SECRET || "";

function createToken(userId: string, accessLevel: String): string {
    const now = Math.floor(Date.now() / 1000);
    const defaultExpiration: number = now + 15 * 60;

    return jwt.sign(
        {
            userId: userId,
            accessLevel,
            exp: defaultExpiration,
        },
        jwtSecret
    );
}

export { createToken };
