import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { Navbar, Nav } from 'react-bootstrap';
import { getUser } from '../auth.js';
import '../CSS/Header.css';

class Header extends React.Component {
	constructor(props) {
		super(props);

		const currentUrl = (window.location.pathname).split('/');
		[, this.currentPage] = currentUrl;
	}

	render() {
		// localStorage.clear();
		console.log('I am being reloaded');
		console.log(getUser());
		return (
			<>
				<div className="App tc f3">
					<Navbar bg="dark" variant="dark" expand="lg">
						<Navbar.Brand href="/"><img id="headerLogo" src="./logo.png" alt="Application Logo" /></Navbar.Brand>
						<Navbar.Toggle aria-controls="basic-navbar-nav" />
						<Navbar.Collapse id="basic-navbar-nav">
							<Nav className="ml-auto">
								{ getUser().username === null? 
								<Nav.Link id={this.currentPage === 'login' ? 'active' : 'notactive'} href="/login">LogIn</Nav.Link> :
									<>
								<Nav.Link id={this.currentPage === 'messages' ? 'active' : 'notactive'} href="/messages">Messages</Nav.Link>
								<Nav.Link id={this.currentPage === 'calculator' ? 'active' : 'notactive'} href="/calculator">Calculator</Nav.Link>
								<Nav.Link id={this.currentPage === 'profile' ? 'active' : 'notactive'} href="/profile"><FontAwesomeIcon icon={faUser} /></Nav.Link></>}
							</Nav>
						</Navbar.Collapse>
					</Navbar>
				</div>

			</>
		);
	}
}

export default Header;
