 //{
//     "username" : "dhana",
//     "email": "dhana3@gmail.com",
//     "password": "Body123"
// }

import express, { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import pool from '../db/db'
import bcrypt from 'bcrypt'

const router = express.Router()


router.post('/login', async (req : Request, res : Response) => {
	const { email, password } = req.body;

	try {
			const user = await pool.query(`SELECT username, email, password FROM users WHERE email=$1`, [email])

	if (!user || user.rows.length === 0) {
		return res.status(400).send({
			success: false,
			message : "User not found Please register"
		})
	}
		
		const validPassword = await bcrypt.compare(password, user.rows[0].password)

		if (!validPassword) {
			return res.status(400).send({
				success: false,
				message : "Invalid password"
			})
		}

		const secret = process.env.JWT_SECRET;
			console.log(secret);

	
		if (!secret) {
			throw new Error("jwt secret not found")
		}

	
		const username = user.rows?.[0]?.username ?? null;


	const token = jwt.sign({ username, email }, secret, { expiresIn: '1d' })
		
		res.send({
			success: true,
			message: "User logged in successfully",
			data: {
				email,
				token
			}
		})

		
		
	} catch (e) {
		res.status(500).send({
			success: false,
			message: "Internal Server Error",
			error : e
		})
	}

})

export {router as loginRouter}