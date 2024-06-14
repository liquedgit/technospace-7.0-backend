import { User } from '@prisma/client';
import DBClient from '../../prisma/prisma.client';

const prisma = DBClient.getInstance().prisma;

export const getUserByEmail = async (email: string) => {
    const user = await prisma.user.findUnique({
        where: { email: email },
        select: {
            id: true,
            email: true,
            name: true,
            password: true,
            role: true,
            roleId: true,
            profilePicture: true,
            createdAt: true,
        },
    });
    return user;
};

export const getUserByID = async (id: string) => {
    const user = await prisma.user.findUnique({
        where: { id: id },
        select: {
            id: true,
            email: true,
            name: true,
            password: true,
            role: true,
            roleId: true,
            profilePicture: true,
            createdAt: true,
        },
    });
    return user;
};

export const isEmailExists = async (email: string): Promise<boolean> => {
    const user = await prisma.user.findUnique({
        where: {
            email: email,
        },
    });
    return !!user;
};
