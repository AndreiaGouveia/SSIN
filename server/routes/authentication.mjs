"use strict";

import express from 'express';
import { register, login } from '../controllers/user.mjs';

let router = express.Router();

router.post('/register',  async (req, res) => {
    console.log('Register');
 
    let username = req.body.username;
    let id = req.body.ID;

    if(username == null){
        return res.status(400).send("ERROR: username not defined.");
    }
    if(id == null){
        return res.status(400).send("ERROR: ID not defined.");
    }

    let result = await register(username, id);

    switch (result){
        case 0:
            return res.status(200).send("Register successfull.");
        case 1:
            return res.status(401).send("Username not found.");
        case 2:
            return res.status(401).send("Wrong ID.");
    }
})

router.post('/login',  async (req, res) => {
    console.log('Login');
 
    let username = req.body.username;
    let id = req.body.ID;

    if(username == null){
        return res.status(400).send("ERROR: username not defined.");
    }
    if(id == null){
        return res.status(400).send("ERROR: ID not defined.");
    }

    let result = await login(username, id);

    switch (result){
        case 0:
            return res.status(200).send("Login successfull.");
        case 1:
            return res.status(401).send("Username not found.");
        case 2:
            return res.status(401).send("Wrong ID.");
    }
})

export default router;
