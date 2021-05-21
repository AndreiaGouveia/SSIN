import React from 'react';
import { Form, Button } from 'react-bootstrap';
import './../CSS/LogIn.css';
import { register } from '../auth.js';
import Header from '../Components/Header';

class LogIn extends React.Component {
  constructor(props) {
    super(props);

    this.performLogIn = this.performLogIn.bind(this);
  }

  async componentDidMount() {

    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: 'RSA-OAEP',
        modulusLength: 4096,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: 'SHA-256'
      },
      true,
      ['encrypt', 'decrypt']
    );


    this.publicKey = await crypto.subtle.exportKey('jwk', keyPair.publicKey);
    this.privateKey = await crypto.subtle.exportKey('jwk', keyPair.privateKey);

    console.log(this.publicKey);
    console.log(this.privateKey);
  }

  async performLogIn(event) {
    let username = event.target[0].value;
    let id = event.target[1].value;

    if (!(await register(username, id, this.publicKey, this.privateKey))) {
      event.preventDefault();
    }
  }
  render() {
    return (
      <>
        <Header />
        <div id='login'>
          <div style={{ marginTop: '8vmax', paddingLeft: '8vmax' }}>
            <h1
              style={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: '7vmax',
              }}
            >
              Secure
            </h1>
            <h1
              style={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: '7vmax',
              }}
            >
              Connection
            </h1>
            <h3
              style={{
                color: '#ececec',
                fontSize: '2vmax',
                paddingTop: '0.5vmax',
              }}
            >
              Expertise. Commitment. Value
            </h3>
          </div>
          <div className='container h-100'>
            <div className='row h-100 justify-content-center align-items-center'>
              <div className='col-10 col-md-8 col-lg-6'>
                <Form id='login-form' onSubmit={this.performLogIn}>
                  <Form.Group controlId='formUsername'>
                    <Form.Control
                      type='text'
                      placeholder='Username'
                      maxLength='8'
                    />
                  </Form.Group>

                  <Form.Group controlId='formID'>
                    <Form.Control
                      type='text'
                      placeholder='ID'
                      maxLength='12'
                      minLength='12'
                      pattern='([A-Z]|[a-z]|[0-9])+'
                    />
                  </Form.Group>
                  <Button variant='primary' type='submit'>
                    Log In
                  </Button>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default LogIn;
