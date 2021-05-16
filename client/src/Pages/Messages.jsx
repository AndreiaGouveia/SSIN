import React, { useState } from 'react';
import Contact from '../Components/Contact';
import Message from '../Components/Message';
import { Scrollbars } from 'react-custom-scrollbars';
import './../CSS/Messages.css';

const Messages = (props) => {
	const [myMessage, setMyMessage] = useState('');
	const [contacts, setContacts] = useState([
		{ id: '4175740862', name: 'Filipe Barbosa' },
		{ id: '1512400931', name: 'Um Gajo' },
		{ id: '6892236940', name: 'Outro Gajo' }
	]);
	const [sentMessages, setSentMessages] = useState([
		{ timestamp: '2018-08-20T13:20:10+0000', content: 'Mensagem teste 1' },
		{ timestamp: '2018-08-22T13:20:10+0000', content: 'Mensagem teste 2' }
	]);
	const [receivedMessages, setReceivedMessages] = useState([
		{ timestamp: '2018-08-19T13:20:10+0000', content: 'Mensagem teste 3' },
		{ timestamp: '2018-08-21T13:20:10+0000', content: 'Mensagem teste 4' }
	]);

	const writeMyMessage = (event) => {
		setMyMessage(event.target.value);
	};

	const sendMyMessage = () => {
		if (!myMessage)
			return;

		const currentDate = new Date();
		setSentMessages([...sentMessages, { timestamp: currentDate.toString(), content: myMessage }]);
		setMyMessage('');
	};

	const onKeyDownTextBox = (event) => {
		if (event.key === 'Enter') {
			event.preventDefault();
			sendMyMessage();
		}
	};

	const getSortedMessageList = () => {
		let messages = [];

		messages = messages.concat(sentMessages.map((message) => { return { ...message, received: false }; }));
		messages = messages.concat(receivedMessages.map((message) => { return { ...message, received: true }; }));

		return messages.sort((firstEl, secondEl) => {
			const firstTimestamp = new Date(firstEl.timestamp);
			const secondTimestamp = new Date(secondEl.timestamp);

			if (firstTimestamp < secondTimestamp)
				return 1;

			if (firstTimestamp > secondTimestamp)
				return -1;

			return 0;
		});
	};

	return (
		<>
			<div id="container">
				<div id="contacts">
					<Scrollbars>
						{contacts.map(contact => <Contact key={contact.id} contactName={contact.name} />)}
					</Scrollbars>
				</div>
				<div id="messages">
					<Scrollbars
						renderView={props => <div {...props} id="message-feed" />}>
						{getSortedMessageList().map((message, index) => <Message key={index} content={message.content} timestamp={message.timestamp} received={message.received} />)}
					</Scrollbars>
					<div id="input-section">
						<input onKeyUp={onKeyDownTextBox} inputMode='text' onChange={writeMyMessage} value={myMessage} />
						<button onClick={sendMyMessage}>Send</button>
					</div>
				</div>
			</div>
		</>
	);
};

export default Messages;
