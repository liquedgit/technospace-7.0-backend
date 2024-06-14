export interface CreateCustomerAgentRoomResponseDto {
    roomId: string,
    customerName: string,
    customerEmail: string,
    state: string,
    agentId: string | null,
    createdAt: Date
}