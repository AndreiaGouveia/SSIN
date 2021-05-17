import React, { useState, useEffect } from 'react';
import { peer, connections, addConnection } from '../webrtc';
import Contact from '../Components/Contact';
import Message from '../Components/Message';
import { Scrollbars } from 'react-custom-scrollbars';
import './../CSS/Messages.css';

const Messages = (props) => {
	const [selectedUserId, setSelectedUserId] = useState('');
	const [selectedUserName, setSelectedUserName] = useState('');
	const [conn, setConn] = useState(null);

	const [myMessage, setMyMessage] = useState('');
	const [contacts, setContacts] = useState([
		{ id: '4175740862', username: 'FilipeBarbosa', name: 'Filipe Barbosa' },
		{ id: '1512400931', username: 'UmGajo', name: 'Um Gajo' },
		{ id: '6892236940', username: 'OutroGajo', name: 'Outro Gajo' }
	]);
	const [sentMessages, setSentMessages] = useState([]);
	const [receivedMessages, setReceivedMessages] = useState([]);

	// Code to populate storage
	// localStorage.setItem('received-messages', JSON.stringify([
	// 	{
	// 		timestamp: '2018-08-19T13:20:10+0000',
	// 		content: 'Mensagem teste 3',
	// 		to: 'me',
	// 		author: 'FilipeBarbosa'
	// 	},
	// 	{
	// 		timestamp: '2018-08-21T13:20:10+0000',
	// 		content: 'Mensagem teste 4',
	// 		to: 'me',
	// 		author: 'FilipeBarbosa'
	// 	},
	// 	{
	// 		timestamp: '2018-08-19T13:20:10+0000',
	// 		content: 'Nós falámos ontem',
	// 		to: 'me',
	// 		author: 'UmGajo'
	// 	},
	// 	{
	// 		timestamp: '2018-08-19T13:21:10+0000',
	// 		content: 'Não te lembras?',
	// 		to: 'me',
	// 		author: 'UmGajo'
	// 	}
	// ]));
	// localStorage.setItem('sent-messages', JSON.stringify([
	// 	{
	// 		timestamp: '2018-08-21T13:25:10+0000',
	// 		content: 'Mensagem teste 5',
	// 		to: 'FilipeBarbosa',
	// 		author: 'me'
	// 	},
	// 	{
	// 		timestamp: '2018-08-19T13:26:10+0000',
	// 		content: 'Não...',
	// 		to: 'UmGajo',
	// 		author: 'me'
	// 	}
	// ]));

	useEffect(() => {
		// TODO: get contacts and select the first one
	}, []);

	useEffect(() => {
		if (!selectedUserName)
			return;

		const receivedMessagesString = localStorage.getItem('received-messages');

		if (!receivedMessagesString)
			return;

		const userReceivedMessages = JSON.parse(receivedMessagesString).filter(message => message.author === selectedUserName);

		setReceivedMessages(userReceivedMessages);

		const sentMessagesString = localStorage.getItem('sent-messages');

		if (!sentMessagesString)
			return;

		const userSentMessages = JSON.parse(sentMessagesString).filter(message => message.to === selectedUserName);

		setSentMessages(userSentMessages);

	}, [selectedUserName]);

	useEffect(() => {
		if (!selectedUserId)
			return;

		if (conn)
			return;

		const foundConn = connections.find(connection => connection.peer === selectedUserId);

		if (foundConn) {
			foundConn.on('data', function (data) {
				console.log('Received', data);
				setReceivedMessages([...receivedMessages, data]);
				// TODO: store message in session storage
			});
		} else {
			const conn = peer.connect(selectedUserId);

			addConnection(conn, false);
			setConn(conn);

			conn.on('open', function () {
				console.log('I oppened a connection!');

				// Receive messages
				conn.on('data', function (data) {
					console.log('Received', data);
					setReceivedMessages([...receivedMessages, data]);
					// TODO: store message in session storage
				});
			});

			conn.on('error', function (err) {
				console.log('Sorry, could not open connection.');
				console.log(err);

				conn.close();
			});

			conn.on('close', function () {
				console.log('Connection has been closed');
			});
		}
	}, [selectedUserId, receivedMessages, conn]);

	const writeMyMessage = (event) => {
		setMyMessage(event.target.value);
	};

	const sendMyMessage = () => {
		if (!myMessage)
			return;

		if (!conn)
			return;

		const currentDate = new Date();
		const messageObject = { timestamp: currentDate.toString(), content: myMessage };

		conn.send(messageObject);

		setSentMessages([...sentMessages, messageObject]);
		// TODO: store message in session storage
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
						{contacts.map(contact => <Contact key={contact.id} contactName={contact.name} onClick={() => {
							setSelectedUserName(contact.username);
							setSelectedUserId(contact.id);
						}} selected={contact.username === selectedUserName} />)}
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
