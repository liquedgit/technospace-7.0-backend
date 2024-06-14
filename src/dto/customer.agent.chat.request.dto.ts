export interface CustomerAgentChatRequestDto {
    roomId: string
    message: string
    name: string | null
    userId: string | null
}