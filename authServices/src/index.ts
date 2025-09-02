import 'dotenv/config'
import express, { Request, Response } from 'express'
import { signinRouter } from './routes/signup'
import { loginRouter } from './routes/login';
import { currentUserRouter } from './routes/currentUser';
import pool from './db/db';
import authMiddleware from './middlewares/authmiddleware';
import cors from 'cors';


const app = express();
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,
}));
app.use(express.json())

async function initDB() {
	await pool.query(`
			CREATE TABLE IF NOT EXISTS users(
				id SERIAL PRIMARY KEY,
				username VARCHAR(50) NOT NULL,
				email VARCHAR(255) UNIQUE NOT NULL,
				password TEXT UNIQUE NOT NULL,
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
			)
		`)
}


initDB().then(res => console.log("DB connected successfully"))
.catch(e => console.log("failed to connect db", e))

app.use('/api/users', signinRouter)
app.use('/api/users', loginRouter)
app.use('/api/users', currentUserRouter)

app.get('/', (req : Request, res : Response) => {
	res.send("hello")
})


const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
	console.log(`App is listening on ${PORT}`)
})

