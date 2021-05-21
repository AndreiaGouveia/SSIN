import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEquals, faPlus, faTimes, faDivide } from '@fortawesome/free-solid-svg-icons';
import { Form, Button } from 'react-bootstrap';
import Header from '../Components/Header';
import { service } from '../services';
import '../CSS/Calculator.css';

class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      value1: '',
      value2: '',
      response: '',
      selectedOperation: 1
    };

    this.onSelectChange = this.onSelectChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSelectChange(event) {
    this.setState({ selectedOperation: event.target.value });
  }

  async onSubmit() {
    //ask the api for the answer
    const result = await service(this.state.value1, this.state.value2, this.state.selectedOperation);
    this.setState({ response: result });
  }

  render() {
    console.log(this.state.selectedOperation);
    return (
      <>
        <Header />
        <div id='content'>
          <h1 style={{ color: 'white', fontWeight: 'bold', fontSize: '6vmax' }}>
            Operations
          </h1>
          <div id='calculatorContent'>
            <div id='calculatorInput'>
              <Form id='calculator-form'>
                <Form.Group controlId='formCalculator'>
                  <Form.Control style={{
                    marginBottom: '5vh'
                  }}
                    as="select" onChange={this.onSelectChange}>
                    <option value={1}>Add</option>
                    <option value={2}>Multiply</option>
                    <option value={3}>Divide</option>
                  </Form.Control>
                  <Form.Control
                    type='text'
                    placeholder='Operation...'
                    onChange={(e) => this.setState({ value1: e.target.value })}
                    style={{
                      marginBottom: '3vh'
                    }}
                  />
                  <FontAwesomeIcon
                    style={{
                      color: '#48cfac',
                      fontSize: '7vmax',
                    }}
                    icon={(this.state.selectedOperation == 1 ? faPlus : (this.state.selectedOperation == 2 ? faTimes : faDivide))}
                  />
                  <Form.Control
                    type='text'
                    placeholder='Operation...'
                    onChange={(e) => this.setState({ value2: e.target.value })}
                    style={{
                      marginTop: '3vh'
                    }}
                  />
                </Form.Group>
                <Button variant='primary' type='button' onClick={this.onSubmit}>
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
