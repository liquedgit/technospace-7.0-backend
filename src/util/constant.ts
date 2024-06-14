import { Secret } from "jsonwebtoken";

export const jwtSecret: Secret =
    process.env.JWT_SECRET || "rLnz6M3z1C6ZQQxNXjWHtQaz8GIDZB";

export const profilePictureRelativePath: string =
    "./src/public/profilePicture/";