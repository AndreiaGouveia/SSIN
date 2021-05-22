"use strict";

import express from 'express';
import { register, login, pre_register } from '../controllers/user.mjs';

let router = express.Router();

router.get('/pre-register', async (req, res) => {
    res.render('pre-register');
})

router.post('/pre-register', async (req, res) => {
    console.log('Pre-Register');
    console.log(req.body);
    let username = req.body.username;
    let fullName = req.body.fullName;
    let clearanceLvl = req.body.clearanceLvl;

    if (username == null) {
        return res.render('pre-register', { error: "Insert Username." });
    }
    if (username.length > 8) {
        return res.render('pre-register', { error: "Username can only have 8 characters." });
    }
    if (fullName == null) {
        return res.render('pre-register', { error: "Insert Full Name." });
    }
    if (clearanceLvl == null) {
        return res.render('pre-register', { error: "Insert Clearence Level." });
    }

    let user = await pre_register(username, fullName, clearanceLvl);

    if (!user) {
        return res.render('pre-register', { error: "Username already in use." });
    }

    return res.render('pre-register-success', { user: user });
})

router.post('/register', async (req, res) => {
    console.log('Register');

    let username = req.body.username;
    let id = req.body.ID;
    let publicEncKey = req.body.publicEncKey;
    let publicSignKey = req.body.publicSignKey;

    if (username == null) {
        return res.status(400).send("ERROR: username not defined.");
    }
    if (id == null) {
        return res.status(400).send("ERROR: ID not defined.");
    }

    let result = await register(username, id, publicEncKey, publicSignKey);

    switch (result) {
        case 0:
            return res.status(200).send("Register successfull.");
        case 1:
            return res.status(401).send("Username not found.");
        case 2:
            return res.status(401).send("Wrong ID.");
    }
})

router.post('/login', async (req, res) => {
    console.log('Login');

    let username = req.body.username;
    let id = req.body.ID;

    if (username == null) {
        return res.status(400).send("ERROR: username not defined.");
    }
    if (id == null) {
        return res.status(400).send("ERROR: ID not defined.");
    }

    let result = await login(username, id);

    switch (result) {
        case 0:
            return res.status(200).send("Login successfull.");
        case 1:
            return res.status(401).send("Username not found.");
        case 2:
            return res.status(401).send("Wrong ID.");
    }
})

export default router;
