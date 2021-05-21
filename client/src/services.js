import { callApiWithToken } from './fetch';

export const service = async (value1, value2, service) => {

    const serviceEndpoint = `http://localhost:8080/service_${service}`;

    try {
        let result = await callApiWithToken(serviceEndpoint, null, 'POST',
            {
                value1: parseFloat(value1),
                value2: parseFloat(value2)
            });

        if (result.status === 200) {
            return (await result.json()).result;
        }else {
           return 'Error';
        }
    } catch (err) {
        console.log(err);
        return 'Error';
    }
};

export const getUser = () => {
    return {
        'username' : localStorage.getItem('username'),
        'privateKey' : localStorage.getItem('privateKey'),
    };
};

