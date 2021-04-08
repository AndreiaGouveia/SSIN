import React from 'react';
import './../CSS/Messages.css';

class Messages extends React.Component {
	constructor(props) {
		super(props);

		// This is useless for now, but i think that we will have states later on, so ignore the warnings
	}

	render() {
		return (
			<>
				<div id="container">
					<div id="contacts">

					</div>
					<div id="messages">

					</div>
				</div>
			</>
		);
	}
}

export default Messages;
