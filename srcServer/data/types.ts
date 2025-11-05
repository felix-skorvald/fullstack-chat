// USER

export interface LoginBody {
    username: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    userId: string;
    token: string;
}

// MESSAGE

export interface Message {
    pk: string;
    sk: string;
    message: string;
    senderId: string;
    receiverId: string;
    senderName: string;
    timestamp: string;
    messageId: string;
}

export interface SendMessageBody {
    message: string;
    senderId: string;
    receiverId: string;
    senderName: string;
}

// Används för body vid request: /login och /register
export interface UserBody {
    username: string;
    password: string;
}

export interface JwtResponse {
    success: boolean;
    token?: string; // JWT
}

export interface Payload {
    userId: string;
    username: string;
    accessLevel: string;
    exp: number;
}

// Beskriver user-items från databasen
export interface UserItem {
    pk: string;
    sk: string;
    username: string;
    passwordHash: string;
    accessLevel: string;
}

export interface ErrorResponse {
    sucess: boolean;
    message: string;
}
