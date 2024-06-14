import { Secret } from "jsonwebtoken";

export const jwtSecret: Secret =
    process.env.JWT_SECRET || "rLnz6M3z1C6ZQQxNXjWHtQaz8GIDZB";

export const openAIApiKey: string =
    process.env.JWT_SECRET || "rLnz6M3z1C6ZQQxNXjWHtQaz8GIDZB";

export const profilePictureRelativePath: string =
    "./src/public/profilePicture/";

export const aiChatBotName: string = "AICHATBOT"
export const pendingCustomerAgentRoomState: string = "PENDING"
export const onGoingCustomerAgentRoomState: string = "ONGOING"
export const finishedCustomerAgentRoomState: string = "FINISHED"