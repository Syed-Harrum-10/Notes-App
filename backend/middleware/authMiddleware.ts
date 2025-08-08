import { Request, Response, NextFunction } from "express"


const jwt = require("jsonwebtoken")


declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

const middleware = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const token = req.cookies?.token;
        if(!token){
            res.status(403).json({
                message: 'No token found'
            })
        }


        const decode = jwt.verify(token, process.env.JWT_SECRET)
        if(!decode){
            res.status(401).json({
                message: 'Unauthorized access'
            })
        }
        req.user = decode;
        next()

    }catch (err){
        console.log('something went wrong in the auth middleware', err.message)
        res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}

module.exports = middleware