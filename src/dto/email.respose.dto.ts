export interface EmailResponseDto {
    emailId: number,
    from: string,
    date: string,
    subject: string,
    bodyText: string | undefined
}