export interface CustomerAgentRoomResponseDto {
    roomId: string,
    customerName: string,
    customerEmail: string,
    state: string,
    agentId: string | null,
    createdAt: Date
}