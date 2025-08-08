const Pool = require('../database/db')
import {Request, Response} from 'express'
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

interface PayloadType {
    id: string,
    name: string,
    email: string,
}

const Register = async (req: Request, res: Response) => {
    try {
        const {name, email, password} = req.body;
        
        const isExists = await Pool.query(`SELECT * FROM auth WHERE email = $1`, [email])
        
        if(isExists.rows.length > 0){
            return res.status(400).json({
                message: 'Email already exists',
                success: false
            })
        }
        
        const hashedPassword = await bcrypt.hash(password, 10)
        const createUser = await Pool.query(`INSERT INTO auth (name, email, password) VALUES ($1, $2, $3) RETURNING *`, [name, email, hashedPassword])
        
        const user = createUser.rows[0];
        
        const payload: PayloadType = {
            id: user.id,  
            name: user.name,
            email: user.email,
        }
        
        const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
            expiresIn: '1h' 
        })
        
        res.status(201).cookie('token', token, {
            httpOnly: true,        
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',    
            maxAge: 60 * 60 * 1000 
        }).json({
            message: 'User registered successfully',
            success: true,
            token: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        })
        
    } catch (err) {
        console.log('Something went wrong in the register', err)
        res.status(500).json({
            message: 'Internal server error',
            success: false
        })
    }
}

const login = async (req: Request, res: Response) => {
    try {
        const {email, password} = req.body;
        const isExists = await Pool.query(`SELECT * FROM auth WHERE email = $1`, [email])
        

        if(isExists.rows.length === 0){
            return res.status(400).json({
                message: 'No user found.',
                success: false
            })
        }
        

        const user = isExists.rows[0]
        const comparePassword = await bcrypt.compare(password, user.password)
        
        if(!comparePassword){
            return res.status(400).json({
                message: 'Email or Password is wrong.',
                success: false
            })
        }
        

        const payload: PayloadType = {
            id: user.id,  
            name: user.name,
            email: user.email,
        }
        
        const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
            expiresIn: '1h' 
        })
        
        res.status(200).cookie('token', token, {
            httpOnly: true,        
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',    
            maxAge: 60 * 60 * 1000 
        }).json({
            message: 'User logged in successfully',
            success: true,
            token: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        })

    } catch (err) {
        console.log('Something went wrong in the login', err)
        res.status(500).json({
            message: 'Internal server error',
            success: false
        })
    }
}

const logout = async (req: Request, res: Response) => {
    try {

        res.clearCookie('token')
        res.status(200).json({
            message: "Logout successfully",
            success: true
        })
    } catch (err) {
        console.log('Something went wrong in the logout', err)
        res.status(500).json({
            message: 'Internal server error',
            success: false
        })
    }
}

module.exports = {
    Register,
    login,
    logout
}