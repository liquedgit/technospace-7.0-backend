import { Request, Response } from "express";
import { getUserByEmail } from "../repository/user.repository";
import { compare, hash } from 'bcrypt';
import jwt, { Jwt, JwtPayload, VerifyErrors } from 'jsonwebtoken';
import { LoginRequestDto } from "../dto/login.request.dto"
import { jwtSecret } from "../util/constant";
import { LoginResponseDto } from "../dto/login.response.dto";
import { ResponseDto } from "../dto/response.dto";

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