import React from 'react';
import PropTypes from 'prop-types';

import './../CSS/Contact.css';

const Contact = (props) => {
	return (
		<>
			<div className={`contact ${props.selected ? 'selected' : ''}`} onClick={props.onClick}>
				<img className="user-image" src="./user_picture.png" width="70em" alt="User" />
				<div className="user-name">{props.contactName}</div>
			</div>
			<hr />
		</>
	);
};

Contact.propTypes = {
	contactName: PropTypes.string.isRequired,
	onClick: PropTypes.func.isRequired,
	selected: PropTypes.bool.isRequired
};

export default Contact;
