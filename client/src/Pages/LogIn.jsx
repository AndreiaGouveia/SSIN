import React from 'react';
import { Form, Button } from 'react-bootstrap';
import './../CSS/LogIn.css';
import { register, exportCryptoKey } from '../auth.js';
import Header from '../Components/Header';
import HomePage from './HomePage';

class LogIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      username: '',
      id: '',
      loggedIn: false,
      error: ''
    };
    this.performLogIn = this.performLogIn.bind(this);
  }

  async componentDidMount() {

    const signKeyPair = await window.crypto.subtle.generateKey(
      {
        name: 'RSASSA-PKCS1-v1_5',
        modulusLength: 2048, //can be 1024, 2048, or 4096
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: { name: 'SHA-256' }, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
      },
      true, //whether the key is extractable (i.e. can be used in exportKey)
      ['sign', 'verify'] //can be any combination of "sign" and "verify"
    );

    console.log('Generated Sign Keys');

    const encryptKeyPair = await window.crypto.subtle.generateKey(
      {
        name: 'RSA-OAEP',
        modulusLength: 4096,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: 'SHA-256'
      },
      true,
      ['encrypt', 'decrypt']
    );
    console.log('Generated Encrypt Keys');

    const privateKeyEncryptPEM = await exportCryptoKey(encryptKeyPair.privateKey, 'pkcs8');
    const privateKeySignPEM = await exportCryptoKey(signKeyPair.privateKey, 'pkcs8');
    const publicKeyEncryptPEM = await exportCryptoKey(encryptKeyPair.publicKey, 'spki');
    const publicKeySignPEM = await exportCryptoKey(signKeyPair.publicKey, 'spki');
    console.log('Generated Encrypt Key PEM');

    this.keys = {
      privateKeyEncryptPEM: privateKeyEncryptPEM,
      publicKeyEncryptPEM: publicKeyEncryptPEM,
      privateKeySignPEM: privateKeySignPEM,
      publicKeySignPEM: publicKeySignPEM
    };

    this.setState({ isLoading: false });
  }

  async performLogIn() {
    let username = this.state.username;
    let id = this.state.id;

    if (await register(username, id, this.keys)) {
      this.setState({ loggedIn: true });
    } else {
      this.setState({ loggedIn: false, error: 'Couldn\'t register client' });
    }
  }
  render() {
    console.log(this.state.loggedIn);
    const isLoading = this.state.isLoading;
    let form;
    if (isLoading) {
      form = <div><p>LOADING RSA KEYS</p></div>;
    } else {
      form =
        <Form id='login-form'>
          <Form.Group controlId='formUsername'>
            <Form.Control type='text' placeholder='Username' maxLength='8' onChange={(event => this.setState({ username: event.target.value }))} />
          </Form.Group>
          <Form.Group controlId='formID'>
            <Form.Control type='text' placeholder='ID' maxLength='12' minLength='12' pattern='([A-Z]|[a-z]|[0-9])+' onChange={(event => this.setState({ id: event.target.value }))} />
          </Form.Group>
          <Button variant='primary' type='button' onClick={this.performLogIn}>Log In</Button>
          <br />
          <span>{this.state.error}</span>
        </Form >;
    }
    return (
      <>
        { this.state.loggedIn ?
          <HomePage /> : <>
            <Header />
            <div id='login'>
              <div style={{ marginTop: '8vmax', paddingLeft: '8vmax' }}>
                <h1
                  style={{
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '7vmax',
                  }}
                >Secure</h1>
                <h1
                  style={{
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '7vmax',
                  }}
                >Connection</h1>
                <h3
                  style={{
                    color: '#ececec',
                    fontSize: '2vmax',
                    paddingTop: '0.5vmax',
                  }}
                >Expertise. Commitment. Value</h3>
              </div>
              <div className='container h-100'>
                <div className='row h-100 justify-content-center align-items-center'>
                  <div className='col-10 col-md-8 col-lg-6'>
                    {form}
                  </div>
                </div>
              </div>
            </div>
          </>
        }
      </>
    );
  }
}

export default LogIn;
