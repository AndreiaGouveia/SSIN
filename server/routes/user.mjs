"use strict";

import express from 'express';
import { getUserInfo } from '../controllers/user.mjs';

let router = express.Router();

router.post('/user', async (req, res) => {
    console.log('User Info');
    let username = req.body.username;
    if(username == null){
        return res.status(400).send("ERROR: username not defined.");
    }
 
    let result = await getUserInfo(username);
  
    res.status(200).send(result);
})

export default router;