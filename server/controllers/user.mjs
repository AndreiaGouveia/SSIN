'use strict';

import crypto from 'crypto';

import User from '../models/user.mjs';

const subtle = crypto.subtle;

function str2ab(str) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

function importRsaKey(pem) {
    // fetch the part of the PEM string between header and footer
    const pemHeader = "-----BEGIN PUBLIC KEY-----";
    const pemFooter = "-----END PUBLIC KEY-----";
    const pemContents = pem.substring(pemHeader.length, pem.length - pemFooter.length);

    const binaryDer = Buffer.from(pemContents, 'base64').toString('binary')

    return subtle.importKey(
        "spki",
        binaryDer,
        {
            name: "RSA-OAEP",
            hash: "SHA-256"
        },
        true,
        ['encrypt', 'decrypt']
    );
}

function decrypt(id, publicEncKey, publicSignKey) {
    return id;
    /*return subtle.decrypt(
        {
            name: "RSA-OAEP"
        },
        key,
        ciphertext
    );*/
}

/**
 * 
 * @param username 
 * @param id 
 * @returns user
 */
const pre_register = async (username, fullName, clearanceLvl) => {
    let user = await User.findUser(username);

    if (user) {
        return null; // username already in use
    }

    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let stringId = '';
    for (let i = 0; i < 12; i++) {
        stringId += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    user = User.create({
        username: username,
        fullName: fullName,
        clearanceLvl: clearanceLvl,
        stringId: stringId
    });

    return user; // register successfull
}

/**
 * 
 * @param username 
 * @param id 
 * @returns 0 -> register successfull
 *          1 -> username not found
 *          2 -> wrong ID
 *          3 -> user already registered
 */
const register = async (username, id, publicEncKey, publicSignKey) => {
    let user = await User.findUser(username);

    if (!user) {
        return 1; // username not found
    }

    console.log(user);
    console.log(user.registered);

    if (user.registered) {
        return 3; // user already registered
    }

    if (decrypt(id, publicEncKey, publicSignKey) !== user.stringId) {
        return 2; // wrong ID
    }

    await user.updateOne({
        registered: true,
        publicEncKey: publicEncKey,
        publicSignKey: publicSignKey
    })

    return 0; // register successfull
}

/**
 * 
 * @param username 
 * @param id 
 * @returns 0 -> login successfull
 *          1 -> username not found
 *          2 -> wrong ID
 */
const login = async (username, id) => {
    let user = await User.findUser(username);

    if (!user) {
        return 1; // username not found
    }

    if (decrypt(id, user.publicEncKey, user.publicSignKey) !== user.stringId) {
        return 2; // wrong ID
    }

    return 0; // login successfull
}

const getClientsInfo = async () => {
    let users = await User.find({}, 'username fullName publicEncKey publicSignKey socket').exec();
    return users;
}

const getUserInfo = async (username) => {
    return await User.findUser(username);
}

export { pre_register, register, login, getClientsInfo, getUserInfo };
