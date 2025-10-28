import { z } from "zod";

const messageSchema = z.object({
    senderId: z.string().min(1),
    receiverId: z.string().min(1),
    senderName: z.string().min(1),
    message: z.string().min(1),
    timestamp: z.string().min(1),
    pk: z.literal("MESSAGE"),
    sk: z.string().min(1),
});

type Message = z.infer<typeof messageSchema>;

const messagesSchema = z.array(messageSchema);

type Messages = z.infer<typeof messagesSchema>;


export {
    messageSchema,
    messagesSchema,
};

export type {
    Message,
    Messages,
};