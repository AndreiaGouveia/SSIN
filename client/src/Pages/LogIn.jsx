import React from 'react';
import { Form, Button } from 'react-bootstrap';
import HomePage from './HomePage';
import './../CSS/LogIn.css';
import { register } from '../auth.js';
import { Redirect } from 'react-router-dom';

class LogIn extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: false,
    };

    // This is useless for now, but i think that we will have states later on, so ignore the warnings

    this.performLogIn = this.performLogIn.bind(this);
  }

  performLogIn(event) {
    let username = event.target[0].value;
    let id = event.target[1].value;

	//to do : inserir função para buscar as keys
    let publicKey = 'sou a public key';
    let privateKey = 'sou a private key';

    if (register(username, id, publicKey, privateKey)) {
      this.setState({ redirect: true });
    }
  }
  render() {
    if (!this.state.redirect) {
      return (
        <>
          <div id='login'>
            <HomePage />

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
    } else {
      return <Redirect push to='/' />;
    }
  }
}

export default LogIn;
