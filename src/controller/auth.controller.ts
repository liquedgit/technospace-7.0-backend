import { Request, Response } from "express";
import { getUserByEmail, getUserByID, updatePassword as uPassword } from "../repository/user.repository";
import { compare, hash } from 'bcrypt';
import jwt, { Jwt, JwtPayload, VerifyErrors } from 'jsonwebtoken';
import { LoginRequestDto } from "../dto/login.request.dto"
import { jwtSecret } from "../util/constant";
import { LoginResponseDto } from "../dto/login.response.dto";
import { ResponseDto } from "../dto/response.dto";
import { UpdatePasswordRequestDto } from "../dto/update.password.request.dto";
import { randomInt } from "crypto";

export const login = async (req: Request, res: Response) => {
    try {
        const reqBody: LoginRequestDto = req.body;
        const user = await getUserByEmail(reqBody.email)
        if (!user) {
            return res.status(400).json({ errors: ["Email not found"] })
        }

        const match = await compare(reqBody.password, user.password);
        if (!match) {
            return res.status(403).json({ errors: ["wrong credentials!"] });
        }

        const jwtToken = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            jwtSecret,
            {
                expiresIn: '1d',
            }
        );


        const loginResponseDto: LoginResponseDto = {
            token: jwtToken
        }

        const responseDto: ResponseDto<LoginResponseDto> = {
            data: loginResponseDto
        }

        return res.status(200).json(responseDto);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ errors: ["Internal server error"] });
    }
}

export const updatePassword = async (req: Request, res: Response) => {
    try {
        const id = req.jwtPayload.id

        const user = await getUserByID(id)
        if (user != null) {

            const reqBody: UpdatePasswordRequestDto = req.body

            const match = await compare(reqBody.currentPassword, user.password);
            if (!match) {
                return res.status(403).json({ errors: ["wrong credentials!"] });
            }

            const bcryptSecret = randomInt(10)
            const hashedNewPassword = await hash(reqBody.newPassword, bcryptSecret)

            const isSuccess = await uPassword(user.id, hashedNewPassword)

            if (isSuccess) {
                const webResponseDTO: ResponseDto<null> = {
                    data: null
                }
                return res.status(200).json(webResponseDTO)
            }
            return res.status(400).json({ errors: ["Update failed"] });
        }
        return res.status(400).json({ errors: ["User not found"] });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ errors: ["Internal server error"] });
    }
}