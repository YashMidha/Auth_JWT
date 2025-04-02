import express from 'express';
import pool from '../config/db.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get("/", auth, async (req, res) => {
    try {
        const user = await pool.query(
            "SELECT name FROM users WHERE id = $1",
            [req.user.id]
        );

        res.json(user.rows[0]);

    } catch (err) {
        console.error(err.message);
        res.send({message: "Server Error"});
    }
});

export default router;