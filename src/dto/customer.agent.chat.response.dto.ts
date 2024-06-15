export interface CustomerAgentChatResponseDto {
    chatId: string
    roomId: string
    message: string
    name: string | null
    userId: string | null
    createdAt: Date
}