"use strict";

import express from 'express';

import { getClientsSockets } from '../controllers/user.mjs';
import { service1 } from '../controllers/service1.mjs';
import { service2 } from '../controllers/service2.mjs';
import { service3 } from '../controllers/service3.mjs';

let router = express.Router();

router.get('/clients', async (req, res) => {
    console.log('Clients Info');
 
    let result = await getClientsSockets();
  
    res.status(200).send(result);
})

router.get('/service_1', async (req, res) => {
    console.log('Service_1');
 
    let result = await service1('Service_1', '');
  
    res.status(200).send(result);
})

router.get('/service_2', async (req, res) => {
    console.log('Service_2');
 
    let result = await service2('Service_2', '');
  
    res.status(200).send(result);
})

router.get('/service_3', async (req, res) => {
    console.log('Service_3');
 
    let result = await service3('Service_3', '');
  
    res.status(200).send(result);
})

export default router;
