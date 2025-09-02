import express, {Request, Response, NextFunction} from 'express'
import jwt from 'jsonwebtoken'

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
	try {

	const authHeaders = req.headers.authorization;
	if (!authHeaders || !authHeaders.startsWith('Bearer ')) {
		return res.send({
			success: false,
			message : "Unable to retrive token"
		})
	}

	const secret = process.env.JWT_SECRET;
	if (!secret) {
		return res.send({
			success: false,
			message : "Unable to retrive jwt secret"
		})
	}

	const token = authHeaders.split(' ')[1]
		const decoded = jwt.verify(token, secret)
		req.body.user = decoded; 
	next()
	}
	catch (e) {
		console.error("JWT VERIFY ERROR:", e)
		    return res.status(401).send({
      success: false,
      message: "Invalid token",
    });
	}


}

export default authMiddleware