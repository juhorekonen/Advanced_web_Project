import { Request, Response, Router } from "express"
import { body, Result, ValidationError, validationResult } from "express-validator"
import bcrypt from "bcrypt"
import jwt, { JwtPayload } from "jsonwebtoken"
import { User, IUser } from "../models/User"
// import { validateToken } from "../middleware/validateToken"

const router: Router = Router()

// User Registration with very short validation for username and password
router.post("/api/user/register",
    body("username")
        .trim()
        .isLength({ min: 3, max: 20 })
        .withMessage("Username must be between 3 and 20 characters long")
        .escape(),
    body("password")
        .isLength({ min: 5 })
        .withMessage("Password must be at least 5 characters long")
        .matches(/\d/)
        .withMessage("Password must contain at least one number")
        .matches(/[!@#$%^&*(),.?":{}|<>]/)
        .withMessage("Password must contain at least one special character")
        .escape(),
    async (req: Request, res: Response) => {
        
        const errors: Result<ValidationError> = validationResult(req)

        if (!errors.isEmpty()) {
            console.log(errors)
            res.status(400).json({ errors: errors.array() })
            return
        }

        try {
            // Check if the user already exists
            const existingUser: IUser | null = await User.findOne({ username: req.body.username })
            // console.log(existingUser)

            if (existingUser) {
                res.status(403).json({ message: "Username already in use" })
                return
            }

            // Otherwise hash the user's password
            const salt: string = bcrypt.genSaltSync(10)
            const hash: string = bcrypt.hashSync(req.body.password, salt)

            // Create a new user
            const newUser: IUser = new User ({
                username: req.body.username,
                password: hash
            })

            await User.create(newUser)
            // console.log("User registered successfully")
            res.status(200).json({ message: "User registered successfully" })
            return
            
        } catch (error: any) {
            console.error(`Error occurred while registering user: ${error}`)
            res.status(500).json({ message: "Internal server error" })
            return
        }
    }
)


// User Authentication when logging in
router.post("/api/user/login",
    body("username").trim().escape(),
    body("password").escape(),
    async (req: Request, res: Response) => {
        try {
            // Find the correct user
            const user: IUser | null = await User.findOne({ username: req.body.username })

            if (!user) {
                res.status(401).json({ message: "User was not found" })
                return
            }

            // Check that the password is correct
            if (bcrypt.compareSync(req.body.password, user.password)) {
                const jwtPayload: JwtPayload = {
                    id: user._id,
                    username: user.username
                }
                const token: string = jwt.sign(jwtPayload, process.env.SECRET as string, {expiresIn: "48h"})

                res.status(200).json({ success: true, token })
                // console.log(`User authenticated successfully`)
                return
            }
            res.status(401).json({ message: "Login failed, invalid credentials" })
            return

        } catch (error: any) {
            console.error(`Error occurred while authenticating user: ${error}`)
            res.status(500).json({ message: "Internal server error" })
            return
        }
    }
)

export default router
