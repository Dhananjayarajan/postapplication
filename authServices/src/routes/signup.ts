import express, { Request, Response } from 'express'
import pool from '../db/db'
import bcrypt from 'bcrypt'

const router = express.Router()

router.post('/signup', async (req : Request, res : Response)=> {
	let { username, email, password } = req.body
	const existingUser = await pool.query(`SELECT email from users WHERE email = $1`, [email])
	if (existingUser.rows.length > 0) {
		return res.status(400).send({
			success: false,
			message:"User already exists"
		})
	}

	const salt = await bcrypt.genSalt(10)
	const hashedPassword = await bcrypt.hash(password, salt)
	password = hashedPassword;

	const savedUser = await pool.query(`INSERT INTO users(username, email, password)
			VALUES($1, $2, $3)
		`, [username, email, password])

	res.status(201).send({
		success: true,
		message: 'User created successfully',
		data: {
			username,
			email,
			password
		}
	})
	
})

export {router as signinRouter}