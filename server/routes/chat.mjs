"use strict";

import express from 'express';

let router = express.Router();

const contacts = [];

router.get('/chat/contacts', async (req, res) => {
    console.log('Chat Contacts');

    res.status(200).send(contacts);
})

router.post('/chat/register', async (req, res) => {
    console.log('Chat Register');

    let username = req.body.username;
    let name = req.body.name;
    let chat_id = req.body.chat_id;

    if (contacts.find(contact => contact.username === username)) {
        res.sendStatus(400);
    } else {
        contacts.push({ username: username, name: name, chat_id: chat_id });
        res.sendStatus(200);
    }
})

export default router;