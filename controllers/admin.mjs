import { db } from '../db.mjs'
import jwt from 'jsonwebtoken'

export const getUsers = ('/', (req, res) => {
    const token = req.cookies.access_token
    if (!token) return res.status(401).json('User not authenticated!')

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json("Token is invalid!")

        if (user.role !== 'admin') return res.status(403).json("not admin!")

        const q = "SELECT `email`, `username`, `img`, `id`,`role` FROM users"

        db.query(q, [], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json(data);
        })
    })
})

export const updateUser = ('/', async function (req, res) {
    for (const update of req.body) {
        let updates = Object.getOwnPropertyNames(update);
        updates = updates.slice(1, updates.length);

        for (const updateName of updates) {
            const q = `UPDATE users SET ${updateName}=? WHERE id=?`;

            await db.query(q, [update[updateName], update.id], async (err, data) => {
                if (err) return res.status(500).json(err);
            });
        }
    }

    res.status(200).json('Done');
})