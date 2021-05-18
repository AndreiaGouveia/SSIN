'use strict';

import User from '../models/User.mjs';

/**
 * 
 * @param username 
 * @param id 
 * @returns 0 -> update connection successfull
 */
const update_connection = async (username, socket) => {
    let user = await User.findOneAndUpdate({username: username}, {socket: socket});

    if(!user){
        return 1; // user not found
    }

    return 0; // update connection successfull
}

export { update_connection };
