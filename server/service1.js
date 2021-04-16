'use strict';

async function service1(username, password){
    return username + password;
}

module.exports = service1;