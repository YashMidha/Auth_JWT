import express from 'express';
import bcrypt from 'bcrypt';
import pool from '../config/db.js';
import jwtGenerator from '../utils/jwtGenerator.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!email || !password || !name){
            return res.json({ message: "Missing Credentials" });
        }

        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

        if (user.rows.length > 0) {
            return res.json({ message: "User already exists" });
        }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const bcryptPassword = await bcrypt.hash(password, salt);

        const newUser = await pool.query(
            "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
            [name, email, bcryptPassword]
        );

        const token = jwtGenerator(newUser.rows[0].id);

        res.json({ token });

    } catch (err) {
        console.error(err.message);
        res.json({message: "Server Error"});
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password){
            return res.json({ message: "Missing Credentials" });
        }
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

        if (user.rows.length === 0) {
            return res.json({ message: "Invalid credentials" });
        }

        const validPassword = await bcrypt.compare(password, user.rows[0].password);

        if (!validPassword) {
            return res.json({ message: "Invalid credentials" });
        }

        const token = jwtGenerator(user.rows[0].id);
        res.json({ token });

    } catch (err) {
        console.error(err.message);
        res.send({message: "Server Error"});
    }
});

router.get("/verify", auth, async (req, res) => {
    try {
        res.json(true);
    } catch (err) {
        console.error(err.message);
        res.send({message: "Server Error"});
    }
});

export default router;
