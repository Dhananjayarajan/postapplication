import express, { Request, Response } from 'express'
import authMiddleware from '../middlewares/authmiddleware'
import pool from '../db/db'

const router = express.Router()

router.get('/currentUser', authMiddleware, async (req: Request, res: Response) => {

	try {
			const {email} = req.body.user
	const currentUser = await pool.query(`SELECT username, email from users where email = $1`, [email])

	if (!currentUser) {
		return res.status(400).send({
			success: false,
			message : 'Unable to retrive current user please login again'
		})
	}

	res.send({
		success: true,
		data : currentUser.rows[0]
	})
	}
	catch (e) {
		console.error(e)
		 res.status(400).send({
			success: false,
			message : 'Unable to retrive current user please login again'
		})
	}


})


export {router as currentUserRouter}