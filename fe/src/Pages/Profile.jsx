import React from 'react';
import HomePage from './HomePage';
import './../CSS/Profile.css';

class Profile extends React.Component {
	constructor(props) {
		super(props);

		// This is useless for now, but i think that we will have states later on,
		// so ignore the warnings
	}

	render() {
		return (
			<>
				<div id="container">
					<HomePage />

					<div id="profile">
						<h1>Name</h1>
						<h2>Description</h2>
						<hr id="separator" />
						<h3>Level #</h3>
					</div>
				</div>
			</>
		);
	}
}

export default Profile;
