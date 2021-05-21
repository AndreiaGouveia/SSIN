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

  async performLogIn(event) {
    let username = event.target[0].value;
    let id = event.target[1].value;

    // TODO : inserir função para buscar as keys
    let publicKey = 'sou a public key';
    let privateKey = 'sou a private key';

    if (!(await register(username, id, publicKey, privateKey))) {
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
