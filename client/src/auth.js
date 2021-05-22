import { callApiWithToken } from './fetch';
import bcrypt from 'bcryptjs';

export const ab2str = (buf) => {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
};

export const str2ab = (str) => {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
};

export const importRsaSignKey = async (pem, type, usage) => {
    // fetch the part of the PEM string between header and footer
    const pemHeader = '-----BEGIN PUBLIC KEY-----';
    const pemFooter = '-----END PUBLIC KEY-----';
    const pemContents = pem.substring(pemHeader.length, pem.length - pemFooter.length);
    // base64 decode the string to get the binary data
    const binaryDerString = window.atob(pemContents);
    // convert from a binary string to an ArrayBuffer
    const binaryDer = str2ab(binaryDerString);

    return await window.crypto.subtle.importKey(
        type,
        binaryDer,
        {
            name: 'RSASSA-PKCS1-v1_5',
            hash: { name: 'SHA-256' },
        },
        true,
        [usage]
    );
};

export const importRsaEncKey = async (pem, type, usage) => {
    // fetch the part of the PEM string between header and footer
    const pemHeader = '-----BEGIN PUBLIC KEY-----';
    const pemFooter = '-----END PUBLIC KEY-----';
    const pemContents = pem.substring(pemHeader.length, pem.length - pemFooter.length);
    // base64 decode the string to get the binary data
    const binaryDerString = window.atob(pemContents);
    // convert from a binary string to an ArrayBuffer
    const binaryDer = str2ab(binaryDerString);

    return await window.crypto.subtle.importKey(
        type,
        binaryDer,
        {
            name: 'RSA-OAEP',
            hash: { name: 'SHA-256' },
        },
        true,
        [usage]
    );
};

export const exportCryptoKey = async (key, type) => {
    const exported = await window.crypto.subtle.exportKey(
        type,
        key
    );
    const exportedAsString = ab2str(exported);
    const exportedAsBase64 = window.btoa(exportedAsString);
    const pemExported = `-----BEGIN PUBLIC KEY-----\n${exportedAsBase64}\n-----END PUBLIC KEY-----`;

    return pemExported;
};



export const register = async (username, id, password, keys) => {

    try {
        localStorage.setItem('username', username);
        localStorage.setItem('id', id);

        let result = await callApiWithToken('http://localhost:8080/register', 'POST',
            {
                publicEncKey: keys.publicKeyEncryptPEM,
                publicSignKey: keys.publicKeySignPEM
            });

        if (result.status === 200) {
            console.log('OK');
            const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
            localStorage.setItem('pin', hashedPassword);
            localStorage.setItem('keys', JSON.stringify(keys));
            return true;
        } else {
            console.log('NOT OK');
            localStorage.clear();
            return false;
        }
    } catch (err) {
        console.log(err);
        return false;
    }
};

export const login = async (pin) => {
    const hashedPin = localStorage.getItem('pin');

    if (hashedPin) {
        if(bcrypt.compareSync(pin, hashedPin)){
            sessionStorage.setItem('loggedIn', 'true');
            return true;
        }
    }

    return false;
};
 
export const getUser = () => {
    return {
        'username': localStorage.getItem('username')
    };
};
