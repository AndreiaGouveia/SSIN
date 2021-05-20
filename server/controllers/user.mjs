'use strict';

import User from '../models/user.mjs';


/**
 * 
 * @param username 
 * @param id 
 * @returns user
 */
 const pre_register = async (username, fullName, clearanceLvl) => {
    let user = await User.findUser(username);

    if(user){
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
 */
const register = async (username, id) => {
    let user = await User.findUser(username);

    if(!user){
        return 1; // username not found
    }

    if(id !== user.stringId){
        return 2; // wrong ID
    }

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

    if(!user){
        return 1; // username not found
    }

    if(id !== user.stringId){
        return 2; // wrong ID
    }

    return 0; // login successfull
}

const getClientsSockets = async () => {
    let users = await User.find({}, 'username fullName publicKey socket').exec();
    return users;
}

export { register, login, getClientsSockets };
