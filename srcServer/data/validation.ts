import { z } from "zod";

const messageSchema = z.object({
    senderId: z.string().min(1),
    receiverId: z.string().min(1),
    senderName: z.string().min(1),
    message: z.string().min(1),
    timestamp: z.string().min(1),
    messageId: z.string().min(1),
    pk: z.literal("MESSAGE"),
    sk: z.string().min(1),
});

const signInSchema = z.object({
    username: z.string().min(1),
    password: z.string().min(1),
});

const channel = z.object({
    channelName: z.string().min(1),
    createdBy: z.string().min(1),
    isPrivate: z.boolean(),
    pk: z.string().min(1),
    sk: z.string().min(1),
    channelId: z.string().min(1),
});

const newChannel = z.object({
    channelName: z.string().min(1),
    createdBy: z.string().min(1),
    isPrivate: z.boolean(),
});

type Message = z.infer<typeof messageSchema>;

type signInUser = z.infer<typeof signInSchema>;

type NewChannel = z.infer<typeof newChannel>;

type Channel = z.infer<typeof channel>;

const messagesSchema = z.array(messageSchema);

type Messages = z.infer<typeof messagesSchema>;

export { messageSchema, messagesSchema, signInSchema, newChannel, channel };

export type { Message, Messages, NewChannel, Channel };
