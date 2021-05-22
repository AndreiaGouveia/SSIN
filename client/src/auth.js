import { callApiWithToken } from './fetch';

export const ab2str = (buf) => {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
};

export const exportCryptoKey = async (key) => {
    const exported = await window.crypto.subtle.exportKey(
        'spki',
        key
    );
    const exportedAsString = ab2str(exported);
    const exportedAsBase64 = window.btoa(exportedAsString);
    const pemExported = `-----BEGIN PUBLIC KEY-----\n${exportedAsBase64}\n-----END PUBLIC KEY-----`;

    return pemExported;
};

export const register = async (username, id, keys) => {


    //TODO encrypt with server PubK
    /*
    let enc = new TextEncoder();
    let encID = enc.encode(id);

    const encryptedID = window.crypto.subtle.encrypt(
        {
            name: 'RSA-OAEP'
        },
        keys.privateKey,
        encID
    );
            this.keys = {
      publicKeySign: publicKeySign,
      privateKeySign: privateKeySign,
      publicKeyEncrypt: publicKeyEncrypt,
      privateKeyEncrypt: privateKeyEncrypt,
      publicKeyEncryptPEM: publicKeyEncryptPEM,
      publicKeySignPEM: publicKeySignPEM
    };
    */


    try {
        let result = await callApiWithToken('http://localhost:8080/register', 'POST',
            {
                username: username,
                ID: id,
                publicEncKey: keys.publicKeyEncryptPEM,
                publicSignKey: keys.publicKeySignPEM
            });

        if (result.status === 200) {
            console.log('OK');
            localStorage.setItem('username', username);
            localStorage.setItem('keys', keys);
            return true;
        } else {
            console.log('NOT OK');
            return false;
        }
    } catch (err) {
        console.log(err);
        return false;
    }
};

export const getUser = () => {
    return {
        'username': localStorage.getItem('username'),
        'privateKey': localStorage.getItem('privateKey'),
    };
};

