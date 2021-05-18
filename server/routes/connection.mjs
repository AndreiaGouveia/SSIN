"use strict";

import express from 'express';
import { update_connection } from '../controllers/connection.mjs';

let router = express.Router();

router.post('/update_connection',  async (req, res) => {
    console.log('Update Connection');
 
    let username = req.body.username;
    let socket = req.body.socket;

    if(socket == null){
        return res.status(400).send("ERROR: socket not defined.");
    }

    let result = await update_connection(username, socket);

    switch (result){
        case 0:
            return res.status(200).send("Register successfull.");
        case 1:
            return res.status(401).send("Username not found.");
        case 2:
            return res.status(401).send("Wrong ID.");
    }
})

export default router;
