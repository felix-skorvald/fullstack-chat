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
    sk: string; // "MESSAGE#1#SID#USER#1#RID#USER#2#TIME#..."
    message: string;
    senderId: string;
    receiverId: string; // "USER#2" eller "CHANNEL#1"
    senderName: string;
    timestamp: string;
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

// Beskriver user-items från databasen
export interface UserItem {
    pk: string;
    sk: string;
    username: string;
    password: string;
    accessLevel: string;
}
