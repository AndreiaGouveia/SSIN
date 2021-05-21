import { callApiWithToken } from './fetch';

export const register = async (username, id, publicKey, privateKey) => {

    try {
        let result = await callApiWithToken('http://localhost:8080/register', null, 'POST',
            {
                username: username,
                ID: id,
            });

        if (result.status === 200) {
            localStorage.setItem('username', username);
            localStorage.setItem('privateKey', privateKey);
            return true;
        }else {
           return false;
        }
    } catch (err) {
        console.log(err);
        return false;
    }
};

export const getUser = () => {
    return {
        'username' : localStorage.getItem('username'),
        'privateKey' : localStorage.getItem('privateKey'),
    };
};

