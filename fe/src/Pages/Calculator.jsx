import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEquals } from '@fortawesome/free-solid-svg-icons';
import { Form, Button } from 'react-bootstrap';

class Calculator extends React.Component {
	constructor(props) {
		super(props);

		// This is useless for now, but i think that we will have states later on, so ignore the warnings
	}

	render() {
		return (
			<>
				<div id="content">
					<h1 style={{ color: 'white', fontWeight: 'bold', fontSize: '6vmax' }}>Operations</h1>
					<div id="calculatorContent">
						<div id='calculatorInput'>
							<Form id="login-form">
								<Form.Group controlId="formUsername">
									<Form.Control type="text" placeholder="Username" maxLength="8" />
								</Form.Group>

								<Form.Group controlId="formID">
									<Form.Control type="text" placeholder="ID" maxLength="12" minLength="12" pattern="([A-Z]|[a-z]|[0-9])+" />
								</Form.Group>
								<Button variant="primary" type="submit">
											Log In
								</Button>
							</Form>
						</div>
						<FontAwesomeIcon style={{color:'white' , fontSize:'7vmax'}} icon={faEquals} />
					</div>
				</div>
			</>
		);
	}
}

export default Calculator;
