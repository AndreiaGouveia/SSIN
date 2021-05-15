"use strict";

import express from 'express';
import { register } from '../controllers/register.mjs';

let router = express.Router();

router.post('/register',  async function (req, res) {
    console.log('Register');
 
    let username = req.body.username;
    let password = req.body.password;
 
    let result = await register(username, password);
  
    res.status(200).send(result);
 })

 export default router;