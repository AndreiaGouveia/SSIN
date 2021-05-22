"use strict";

import express from 'express';

import { getClientsInfo, getUserInfo } from '../controllers/user.mjs';
import { service1, service2, service3 } from '../controllers/service.mjs';

let router = express.Router();

const isInteger = function (number) {
    return !Number.isNaN(+number) && !Number.isNaN(parseFloat(number, 10));
};

router.get('/clients', async (req, res) => {
    console.log('Clients Info');

    let result = await getClientsInfo();

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
        res.sendStatus(400).send("value1 and value2 must be integers");
    }
})

router.post('/service_2', async (req, res) => {
    console.log('Service_2');

    if (req.body.username && req.body.value1 && isInteger(req.body.value1) && req.body.value2 && isInteger(req.body.value2)) {
        const userInfo = await getUserInfo(req.body.username);

        if (userInfo.clearanceLvl >= 2) {
            let result = await service2(req.body.value1, req.body.value2);

            const resultObject = {
                result: result
            }

            res.status(200).send(resultObject);
        } else {
            res.sendStatus(401);
        }
    } else {
        res.sendStatus(400).send("value1 and value2 must be integers");
    }
})

router.post('/service_3', async (req, res) => {
    console.log('Service_3');

    if (req.body.username && req.body.value1 && isInteger(req.body.value1) && req.body.value2 && isInteger(req.body.value2)) {
        const userInfo = await getUserInfo(req.body.username);

        if (userInfo.clearanceLvl >= 3) {
            let result = await service3(req.body.value1, req.body.value2);

            const resultObject = {
                result: result
            }

            res.status(200).send(resultObject);
        } else {
            res.sendStatus(401);
        }
    } else {
        res.sendStatus(400).send("value1 and value2 must be integers");
    }
})

export default router;
