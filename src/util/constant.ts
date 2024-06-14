import { Secret } from "jsonwebtoken";

export const jwtSecret: Secret =
    process.env.JWT_SECRET || "rLnz6M3z1C6ZQQxNXjWHtQaz8GIDZB";

export const openAIApiKey: string =
    process.env.JWT_SECRET || "rLnz6M3z1C6ZQQxNXjWHtQaz8GIDZB";

export const emailSender: string =
    process.env.EMAIL_SENDER || "asd@gmail.com";

export const emailSenderPassword: string =
    process.env.EMAIL_SENDER_PASSWORD || "asd123";

export const profilePictureRelativePath: string =
    "./src/public/profilePicture/";

export const aiChatBotName: string = "AICHATBOT"
export const pendingCustomerAgentRoomState: string = "PENDING"
export const onGoingCustomerAgentRoomState: string = "ONGOING"
export const finishedCustomerAgentRoomState: string = "FINISHED"
export const adminRole: string = "Admin"
export const agentRole: string = "Agent"

export const READ_MAIL_CONFIG = {
    imap: {
        user: emailSender,
        password: emailSenderPassword,
        host: 'imap.gmail.com',
        port: 993,
        authTimeout: 10000,
        tls: true,
        tlsOptions: { rejectUnauthorized: false },
    },
};
