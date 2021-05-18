"use strict";

import express from 'express';
import register from './register.mjs';
import services from './services.mjs';
import chat from './chat.mjs'

let router = express.Router();

router.use("/", chat);
router.use("/", register);
router.use("/", services);
router.get("/", (req, res) => res.status(200).send({
    message: 'Welcome to the SSIN API',
}));

export default router;