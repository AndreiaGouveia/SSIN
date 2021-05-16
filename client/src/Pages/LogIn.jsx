import React from 'react';
import { Form, Button } from 'react-bootstrap';
import HomePage from './HomePage';
import './../CSS/LogIn.css';

class LogIn extends React.Component {
	constructor(props) {
		super(props);

		// This is useless for now, but i think that we will have states later on, so ignore the warnings
	}

	render() {
		return (
			<>
				<div id="login">
					<HomePage />

					<div className="container h-100">
						<div className="row h-100 justify-content-center align-items-center">
							<div className="col-10 col-md-8 col-lg-6">
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
						</div>
					</div>
				</div>
			</>
		);
	}
}

export default LogIn;
