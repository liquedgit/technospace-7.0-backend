import { NextFunction, Request, Response } from "express";
import jwt, { Jwt, JwtPayload, VerifyErrors } from "jsonwebtoken";
import { jwtSecret } from "../util/constant";

export const isAuthenticated = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({ errors: ["Token not found!"] });
        }
        jwt.verify(
            token,
            jwtSecret,
            (
                err: VerifyErrors | null,
                decode: Jwt | JwtPayload | string | undefined
            ) => {
                if (err) {
                    return res.status(400).json({ errors: [err.message] });
                }
                if (decode) {
                    req.jwtPayload = decode;
                    return next();
                }
            }
        );
    } catch (error) {
        console.log(error);
        return res.status(400).json({ errors: ["Error occurred!"] });
    }
};