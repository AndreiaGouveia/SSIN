import React from 'react';
import PropTypes from 'prop-types';

import './../CSS/Message.css';

const Message = (props) => {
	return (
		<>
			<div className={`message-bubble ${props.received ? 'left' : 'right'}`}>
				<div className="message-content">{props.content}</div>
			</div>
		</>
	);
};

Message.propTypes = {
	content: PropTypes.string.isRequired,
	timestamp: PropTypes.string.isRequired,
	received: PropTypes.bool
};

export default Message;
