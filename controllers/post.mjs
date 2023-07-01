import { db } from '../db.mjs'
import jwt from 'jsonwebtoken'

export const getPosts = ('/', (req, res) => {
    const query = req.query.category ? "SELECT * FROM posts WHERE cat=?" : "SELECT * FROM posts"

    db.query(query, [req.query.category], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    })
})

export const getPost = ('/:id', (req, res) => {
    const query = "SELECT `email`,`username`, `title`, `desc`,`content`,p.id, p.img, u.img AS userImg , `cat`, `date` FROM users u JOIN posts p ON u.id = p.uid WHERE p.id = ?"
    db.query(query, [req.params.id], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    })
})

export const addPost = ('/', (req, res) => {
    const token = req.cookies.access_token
    if (!token) return res.status(401).json('User not logged in');

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json('Token is invalid!');

        const q = "INSERT INTO posts(`title`, `desc`, `content`, `img`, `cat`, `date`, `uid`) VALUES (?)";
        const values = [
            req.body.title,
            req.body.desc,
            req.body.content,
            req.body.img,
            req.body.cat,
            req.body.date,
            user.id
        ]
        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.json("Post created successfully");
        });
    })
})

export const deletePost = ('/:id', (req, res) => {
    const token = req.cookies.access_token
    if (!token) return res.status(401).json('User not logged in');

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json('Token is invalid!');

        if (user.role === 'admin') {
            const query = 'DELETE FROM posts WHERE id = ?'

            db.query(query, [req.params.id], (err, data) => {
                if (err) return res.status(500).json(err);
                return res.status(200).json(data); sin
            })
        } else {
            const query = 'DELETE FROM posts WHERE id = ? AND uid = ?'

            db.query(query, [req.params.id, user.id], (err, data) => {
                if (err) return res.status(500).json(err);
                return res.status(200).json(data);
            })
        }

    })
})

export const updatePost = ('/:id', (req, res) => {
    const token = req.cookies.access_token
    if (!token) return res.status(401).json('User not logged in');

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json('Token is invalid!');


        const values = [
            req.body.title,
            req.body.desc,
            req.body.content,
            req.body.img,
            req.body.cat,
        ]

        if (user.role === 'admin') {
            let q = "UPDATE posts SET `title`=?, `desc`=?, `content`=?, `img`=?, `cat`=? WHERE `id` = ?"

            db.query(q, [...values, req.params.id], (err, data) => {
                if (err) return res.status(500).json(err);
                return res.status(200).json(data);
            })

        } else {
            let q = "UPDATE posts SET `title`=?, `desc`=?, `content`=?, `img`=?, `cat`=? WHERE `id` = ? AND `uid` = ?"

            db.query(q, [...values, req.params.id, user.id], (err, data) => {
                if (err) return res.status(500).json(err);
                return res.status(200).json(data);
            })
        }
    })

})

