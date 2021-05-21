"use strict";

import express from 'express';

import { getClientsSockets } from '../controllers/user.mjs';
import { service1 } from '../controllers/service1.mjs';
import { service2 } from '../controllers/service2.mjs';
import { service3 } from '../controllers/service3.mjs';

let router = express.Router();

const isInteger = function (number) {
    return !Number.isNaN(+number) && !Number.isNaN(parseFloat(number, 10));
};

router.get('/clients', async (req, res) => {
    console.log('Clients Info');

    let result = await getClientsSockets();

    res.status(200).send(result);
})

router.post('/service_1', async (req, res) => {
    console.log('Service_1');

    if (req.body.value1 && isInteger(req.body.value1) && req.body.value2 && isInteger(req.body.value2)) {
        let result = await service1(req.body.value1, req.body.value2);

        const resultObject = {
            result: result
        }

        res.status(200).send(resultObject);
    } else {
        res.sendStatus(400);
    }
})

router.post('/service_2', async (req, res) => {
    console.log('Service_2');

    if (req.body.value1 && isInteger(req.body.value1) && req.body.value2 && isInteger(req.body.value2)) {
        let result = await service2(req.body.value1, req.body.value2);

        const resultObject = {
            result: result
        }

        res.status(200).send(resultObject);
    } else {
        res.sendStatus(400);
    }
})

router.post('/service_3', async (req, res) => {
    console.log('Service_3');

    if (req.body.value1 && isInteger(req.body.value1) && req.body.value2 && isInteger(req.body.value2)) {
        let result = await service3(req.body.value1, req.body.value2);

        const resultObject = {
            result: result
        }

        res.status(200).send(resultObject);
    } else {
        res.sendStatus(400);
    }
})

export default router;
