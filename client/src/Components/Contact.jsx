import React from 'react';
import PropTypes from 'prop-types';

import './../CSS/Contact.css';

const Contact = (props) => {
	return (
		<>
			<div className="contact">
				<img className="user-image" src="./user_picture.png" width="70em" alt="User" />
				<div className="user-name">{props.contactName}</div>
			</div>
			<hr />
		</>
	);
};

Contact.propTypes = {
	contactName: PropTypes.string.isRequired
};

export default Contact;
