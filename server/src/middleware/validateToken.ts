import { Request, Response, NextFunction } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

interface CustomRequest extends Request {
    user?: JwtPayload
}

// Function to validate the user's JSON Web Token
export const validateToken = (req: CustomRequest, res: Response, next: NextFunction) => {
    const token: string | undefined = req.header("Authorization")?.split(" ")[1]

    // Check that the token exists
    if(!token) {
        res.status(401).json({message: "Access denied, missing token"})
        return
    }

    try {
        const verified: JwtPayload = jwt.verify(token, process.env.SECRET as string) as JwtPayload
        req.user = verified
        next()

        // In case of any errors the authentication fails
    } catch (error: any) {
        res.status(401).json({message: "Access denied, missing token"})
        return
    }
}

export { CustomRequest }
