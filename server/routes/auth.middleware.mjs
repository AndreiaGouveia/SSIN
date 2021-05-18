"use strict";

import express from 'express';
import { login } from '../controllers/user.mjs';

let router = express.Router();

router.post('/',  async (req, res) => {
    console.log('Auth Middleware');
 
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
            return next();
        case 1:
            return res.status(401).send("Username not found.");
        case 2:
            return res.status(401).send("Wrong ID.");
    }
})

export default router;
