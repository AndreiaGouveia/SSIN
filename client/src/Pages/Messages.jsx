import React, { useState, useEffect, useRef } from 'react';
import { useToasts } from 'react-toast-notifications';
import { peer, connections, addConnection, removeConnection } from '../webrtc';
import { callApiWithToken } from '../fetch';
import Contact from '../Components/Contact';
import Message from '../Components/Message';
import { Scrollbars } from 'react-custom-scrollbars';
import Header from '../Components/Header';
import './../CSS/Messages.css';

const Messages = (props) => {
  const { addToast } = useToasts();

  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedUserName, setSelectedUserName] = useState('');
  const [conn, setConn] = useState(null);

  const [myMessage, setMyMessage] = useState('');
  // Contacts is array of objects:
  // {
  //   username: 'username',
  //   fullName: 'fullname',
  //   socket: 'chat id',
  //   publicEncKey: 'iugdfpaisugf',
  //   publicSignKey: 'iugdfpaisugf'
  // }
  const [contacts, setContacts] = useState([]);
  const [sentMessages, setSentMessages] = useState([]);
  const [receivedMessages, setReceivedMessages] = useState([
    {
      timestamp: new Date().toString(),
      // Content is encrypted with receiver's public key
      content: {
        message: 'some random shit',
        signature: 'iugshpfiasuygdfisa'
      },
      author: 'me',
      to: 'FilipeBarbosa',
    },
  ]);

  const receivedMessagesRef = useRef({});
  receivedMessagesRef.current = receivedMessages;

  useEffect(() => {
    callApiWithToken('http://localhost:8080/clients')
      .then((result) => {
        result
          .clone()
          .text()
          .then((content) => {
            const allContacts = JSON.parse(content);
            const filteredContacts = allContacts.filter(
              (contact) =>
                contact.username !== (localStorage.getItem('username') || '')
            );
            setContacts(filteredContacts);

            if (filteredContacts.length > 0) {
              setSelectedUserId(filteredContacts[0].socket);
              setSelectedUserName(filteredContacts[0].username);
            }
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (!selectedUserName) return;

    const receivedMessagesString = localStorage.getItem('received-messages');

    if (!receivedMessagesString) return;

    const userReceivedMessages = JSON.parse(receivedMessagesString).filter(
      (message) => message.author === selectedUserName
    );

    // TODO: parse local messages setReceivedMessages[0...n].content decrypt

    setReceivedMessages(userReceivedMessages);

    const sentMessagesString = localStorage.getItem('sent-messages');

    if (!sentMessagesString) return;

    const userSentMessages = JSON.parse(sentMessagesString).filter(
      (message) => message.to === selectedUserName
    );

    setSentMessages(userSentMessages);
  }, [selectedUserName]);

  useEffect(() => {
    if (!selectedUserId) return;

    if (conn) return;

    const foundConn = connections.find(
      (connection) => connection.peer === selectedUserId
    );

    if (foundConn) {
      setConn(foundConn);

      foundConn.on('data', function (data) {

        // TODO: decrypt data.content, pass data

        setReceivedMessages([...receivedMessagesRef.current, data]);
      });

      foundConn.on('close', function () {
        setConn(null);
      });
    } else {
      const conn = peer.connect(selectedUserId);

      conn.on('open', function () {
        console.log('I oppened a connection!');

        addConnection(conn, false);
        setConn(conn);

        // Receive messages
        conn.on('data', function (data) {
          let dataView = data;

          // TODO: decrypt dataView.content

          setReceivedMessages([...receivedMessagesRef.current, dataView]);

          const receivedMessagesString =
            localStorage.getItem('received-messages');

          if (receivedMessagesString) {
            const userReceivedMessages = JSON.parse(receivedMessagesString);
            userReceivedMessages.push(data);
            localStorage.setItem(
              'received-messages',
              JSON.stringify(userReceivedMessages)
            );
          } else {
            localStorage.setItem('received-messages', JSON.stringify([data]));
          }
        });

        conn.on('close', function () {
          removeConnection(conn);
          setConn(null);
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
    if (!myMessage) return;

    const contact = contacts.find((user) => user.name === selectedUserName);
    const contactPublicKey = contact.publicKey;

    const privateKey = localStorage.getItem('privateKey');

    let enc = new TextEncoder();
    let encMessage = enc.encode(myMessage);

    const encryptedMessage = window.crypto.subtle.encrypt(
      {
        name: 'RSA-OAEP'
      },
      privateKey,
      encMessage
    );

    if (!conn) {
      addToast('User is offline', {
        appearance: 'info',
        autoDismiss: true,
      });
      return;
    }

    const currentDate = new Date();
    const messageObject = {
      timestamp: currentDate.toString(),
      content: encryptedMessage,
      author: localStorage.getItem('username') || '',
      to: selectedUserName,
    };

    conn.send(messageObject);

    setSentMessages([...sentMessages, messageObject]);

    const sentMessagesString = localStorage.getItem('sent-messages');

    if (sentMessagesString) {
      const userSentMessages = JSON.parse(sentMessagesString);
      userSentMessages.push(messageObject);
      localStorage.setItem('sent-messages', JSON.stringify(userSentMessages));
    } else {
      localStorage.setItem('sent-messages', JSON.stringify([messageObject]));
    }

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

    messages = messages.concat(
      sentMessages.map((message) => {
        return { ...message, received: false };
      })
    );
    messages = messages.concat(
      receivedMessages.map((message) => {
        return { ...message, received: true };
      })
    );

    return messages.sort((firstEl, secondEl) => {
      const firstTimestamp = new Date(firstEl.timestamp);
      const secondTimestamp = new Date(secondEl.timestamp);

      if (firstTimestamp < secondTimestamp) return 1;

      if (firstTimestamp > secondTimestamp) return -1;

      return 0;
    });
  };

  return (
    <>
      <Header />
      <div id='container'>
        <div id='contacts'>
          <Scrollbars>
            {contacts.map((contact) => (
              <Contact
                key={contact.socket}
                contactName={contact.fullName}
                onClick={() => {
                  setSelectedUserName(contact.username);
                  setSelectedUserId(contact.socket);
                }}
                selected={contact.username === selectedUserName}
              />
            ))}
          </Scrollbars>
        </div>
        <div id='messages'>
          <Scrollbars
            renderView={(props) => <div {...props} id='message-feed' />}
          >
            {getSortedMessageList().map((message, index) => (
              <Message
                key={index}
                content={message.content}
                timestamp={message.timestamp}
                received={message.received}
              />
            ))}
          </Scrollbars>
          <div id='input-section'>
            <input
              onKeyUp={onKeyDownTextBox}
              inputMode='text'
              onChange={writeMyMessage}
              value={myMessage}
            />
            <button onClick={sendMyMessage}>Send</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Messages;
