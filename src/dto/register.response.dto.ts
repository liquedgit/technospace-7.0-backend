import { User } from "@prisma/client";

export interface RegisterResponseDto {
    id : string,
    email : string,
    name : string,
    createdAt : Date
}