import { NextFunction, Request, Response } from "express";
import { Role } from "../../generated/prisma/enums";
import { catchAsync } from "../utils/catchAsync";


declare global {
    namespace Express {
        interface Request {
            user?: {
                email: string;
                name: string;
                id: string;
                role: Role;
            }
        }
    }
}


export const auth = (...requiredRoles : Role[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
      const token = req.cookies.accessToken ? req.cookies.accessToken 
      :
      req.headers.authorization?.startsWith("Bearer ")? 
        req.headers.authorization?.split(" ")[1] 
         : 
        req.headers.authorization;
        
        
        if(!token){
            throw new Error("You are not logged in. Please log in to access this resource.");
        }

        const verifiedToken = jwtUtils.verifyToken(token, config.jwt_access_secret);
    })
}