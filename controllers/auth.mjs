import { db } from '../db.mjs'
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

import * as dotenv from 'dotenv'
dotenv.config()

export const register = (req, res) => {
    //CHECK EXISTING USER
    const query = "SELECT * FROM users WHERE email = ?";

    db.query(query, [req.body.email], (err, data) => {

        if (err) return res.status(500).json(err);
        if (data.length) return res.status(409).json("User already exists!");

        //HASHING NEW USER'S PASSWORD
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        const query = "INSERT INTO users(`username`,`email`,`password`, `img`, `role`) VALUES (?)";
        const values = [req.body.username, req.body.email, hash, req.body.img, `user`];

        // CREATING NEW USER
        db.query(query, [values], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("User created successfully!");
        });
    });
};

export const login = (req, res) => {
    // CHECK IF USER EXIST

    const query = "SELECT * FROM users WHERE email = ?"

    db.query(query, [req.body.email], (err, data) => {
        if (err) return res.status(500).json(err);

        if (data.length === 0) return res.status(404).json('User does not exist!');

        // PASSWORD CHECK
        const comparePass = bcrypt.compareSync(req.body.password, data[0].password)

        if (!comparePass) return res.status(400).json('Wrong email or password!')

        const token = jwt.sign({ email: data[0].email, id: data[0].id, role: data[0].role }, process.env.JWT_SECRET_KEY)
        const { password, ...info } = data[0]
        res.cookie('access_token', token, {
            maxAge: 1296000,
            httpOnly: false,
            sameSite: 'none',
            secure: "true"
        }).status(200).json(info)
    })
}

export const logout = (req, res, next) => {
    res.clearCookie('access_token', {
        sameSite: "none",
        secure: "true",
    }).status(200).json('Logged out')
}