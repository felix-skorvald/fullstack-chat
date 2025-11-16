export interface LoginBody {
    username: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    userId: string;
    token: string;
}

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

export interface UserBody {
    username: string;
    password: string;
}

export interface JwtResponse {
    success: boolean;
    token?: string;
}

export interface Payload {
    userId: string;
    username: string;
    accessLevel: string;
    exp: number;
}

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

export interface UserResponse {
    username: string;
    userId: string;
}
export interface UserIdParam {
    userId: string;
}

export interface ChannelResponse {
    channelName: string;
    channelId: string;
    createdBy: string;
    isPrivate: boolean;
}
