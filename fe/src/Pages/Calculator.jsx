import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEquals } from '@fortawesome/free-solid-svg-icons';
import { Form, Button } from 'react-bootstrap';
import '../CSS/Calculator.css';

class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: {},
      value: '',
      response: '',
    };
  }

  onSubmit(value) {
    /*setResponse(value);*/
    console.log('here');
    console.log(value);
  }

  render() {
	console.log(this.state.value);
    return (
      <>
        <div id='content'>
          <h1 style={{ color: 'white', fontWeight: 'bold', fontSize: '6vmax' }}>
            Operations
          </h1>
          <div id='calculatorContent'>
            <div id='calculatorInput'>
              <Form id='calculator-form'>
                <Form.Group controlId='formCalculator'>
                  <Form.Control
                    type='text'
                    as='textarea'
                    placeholder='Operation...'
                    onChange={(e) => this.setState({value: e.target.value})}
                  />
                </Form.Group>
                <Button
                  variant='primary'
                  type='submit'
                  onClick={this.onSubmit}
                >
                  Submit
                </Button>
              </Form>
            </div>
            <FontAwesomeIcon
              style={{
                color: '#48cfac',
                fontSize: '15vmax',
                marginTop: '10vmax',
              }}
              icon={faEquals}
            />
            <div id='calculatorOutput'>
              <h1>{this.state.response}</h1>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Calculator;
