'use strict';

import User from '../models/User.mjs';

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

export { register };
