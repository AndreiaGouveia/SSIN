import { callApiWithToken } from './fetch';

export const login = async (username, id, publicKey, privateKey) => {
    console.log('here');
    console.log(username);
    localStorage.setItem('username', username);
    localStorage.setItem('id', id);
    localStorage.setItem('publicKey', publicKey);
    localStorage.setItem('privateKey', privateKey);
    console.log(localStorage);

    try {
        let result = await callApiWithToken('http://localhost:8080/login', null, 'POST',
            {
                username: username,
                ID: id,
            });

        console.log(result.statusText);
        console.log(result.text());

            console.log(id);
        if (result.status === 200) {
            console.log(' i exist');
        } else {
           console.log('register meeeeeeeeeeee');
           result = await callApiWithToken('http://localhost:8080/register', null, 'POST',
            {
                username: username,
                ID: id,
            });

            if (result.status === 200) {
                console.log(' i exist');
            } else {
                console.log('so sad');
            }
        }
    } catch (err) {
        console.log(err);
    }
};

export const getUser = () => {
    return {
        'username' : localStorage.getItem('username'),
        'id' : localStorage.getItem('id'),
        'publicKey' : localStorage.getItem('publicKey'),
        'privateKey' : localStorage.getItem('privateKey'),
    };
};

