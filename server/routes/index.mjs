"use strict";

import express from 'express';
import authentication from './authentication.mjs';
import auth_middleware from './auth.middleware.mjs';
import connection from './connection.mjs';
import services from './services.mjs';
import user from './user.mjs';

let router = express.Router();

router.use("/", authentication);

router.use("/", auth_middleware);
router.use("/", connection);
router.use("/", services);
router.use("/", user);

router.get("/", (req, res) => res.status(200).send({
    message: 'Welcome to the SSIN API',
}));

export default router;
