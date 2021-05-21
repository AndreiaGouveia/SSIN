import { callApiWithToken } from './fetch';

export const getUser = () => {
    return {
        'username': localStorage.getItem('username'),
        'privateKey': localStorage.getItem('privateKey'),
    };
};

export const service = async (value1, value2, service) => {

    const serviceEndpoint = `http://localhost:8080/service_${service}`;

    try {
        let result = await callApiWithToken(serviceEndpoint, null, 'POST',
            {
                value1: parseFloat(value1),
                value2: parseFloat(value2),
                username: getUser().username
            });

        if (result.status === 200) {
            return (await result.json()).result;
        } else if (result.status === 401) {
            return 'You can\'t do that 😠';
        } else {
            return 'Error 🤕';
        }
    } catch (err) {
        console.log(err);
        return 'Error 🤕';
    }
};

