import React , {useEffect, useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEquals } from '@fortawesome/free-solid-svg-icons';
import { Form, Button } from 'react-bootstrap';
import '../CSS/Calculator.css';

function Calculator () {

	const [loading, setLoading] = useState(true);
	const [data, setData] = useState({});
	const [value, setValue] = useState('hello'),
		onInput = ({target:{value}}) => setValue(value),
		onFormSubmit = e => {
			e.preventDefault();
			console.log(value);
			setValue();
		};
	
	useEffect

	return (
		<>
			<div id="content">
				<h1 style={{ color: 'white', fontWeight: 'bold', fontSize: '6vmax' }}>Operations</h1>
				<div id="calculatorContent">
					<div id="calculatorInput">
						<Form id="calculator-form">
							<Form.Group controlId="formCalculator">
								<Form.Control type="text" placeholder="Calculator" maxLength="8" />
							</Form.Group>
							<Button variant="primary" type="submit">
									Submit
							</Button>
						</Form>
					</div>
					<FontAwesomeIcon style={{color:'#48cfac' , fontSize:'15vmax', marginTop: '10vmax'}} icon={faEquals} />
					<div id="calculatorOutput">
						<h1>{value}</h1>
					</div>
				</div>
			</div>
		</>
	);
}

export default Calculator;
