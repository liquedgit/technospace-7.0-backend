import { User } from '@prisma/client';
import DBClient from '../../prisma/prisma.client';

const prisma = DBClient.getInstance().prisma;

export const CreateUser = async (user: User) => {
    const newUser = await prisma.user.create({ data: user })
    return newUser
}

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

export const updatePassword = async (id: string, newPasswordHashed: string): Promise<boolean> => {
    const user = await prisma.user.update({
        where: {
            id: id,
        },
        data: {
            password: newPasswordHashed
        }
    })

    return !!user;
}