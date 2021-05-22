import React, { useState, useEffect, useRef } from 'react';
import { useToasts } from 'react-toast-notifications';
import { peer, connections, addConnection, removeConnection } from '../webrtc';
import { callApiWithToken } from '../fetch';
import { importRsaSignKey, importRsaEncKey, ab2str, str2ab } from '../auth';
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
  const [receivedMessages, setReceivedMessages] = useState([]);

  const receivedMessagesRef = useRef({});
  receivedMessagesRef.current = receivedMessages;

  const verifyMessages = async (message) => {
    console.log('verify messages');

    let dec = new TextDecoder();
    let enc = new TextEncoder();

    let keys = localStorage.getItem('keys');
    keys = JSON.parse(keys);
    const myPrivateEncKeyPEM = keys.privateKeyEncryptPEM;
    const myPrivateEncKey = await importRsaEncKey(myPrivateEncKeyPEM, 'pkcs8', 'decrypt');


    const viewableMessage = {
      author: message.author,
      to: message.to,
      timestamp: message.timestamp
    };

    const contact = contacts.find((user) => user.username === message.author);
    const contactPublicSignKeyPEM = contact.publicSignKey;
    const contactPublicSignKey = await importRsaSignKey(contactPublicSignKeyPEM, 'spki', 'verify');

    console.log('MESSAGE CONTENT');
    console.log(message.message);

    const encodedMsgContent = str2ab(message.message);
    //const decodedMsgContent = dec.decode(encodedMsgContent);



    const decryptedMessage = await window.crypto.subtle.decrypt(
      {
        name: 'RSA-OAEP',
      },
      myPrivateEncKey, //from generateKey or importKey above
      encodedMsgContent //ArrayBuffer of the data
    );

    const signature = str2ab(message.signature);

    let validMsg = await window.crypto.subtle.verify(
      'RSASSA-PKCS1-v1_5',
      contactPublicSignKey,
      signature,
      decryptedMessage
    );

    const decodedMessage = dec.decode(decryptedMessage);

    viewableMessage.message = validMsg ? decodedMessage : '⚠ This message might not be from this sender';

    return viewableMessage;
  };

  useEffect(() => {
    callApiWithToken('http://localhost:8080/clients', 'POST')
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
    async function populateRecieved(receivedMsgs) {

      const userRcvMsgDec = [];
      for (let i = 0; i < receivedMsgs.length; i++) {
        let newMsg = await verifyMessages(receivedMsgs[i]);
        userRcvMsgDec.push(newMsg);
      }
      setReceivedMessages(userRcvMsgDec);

    }
    if (!selectedUserName) return;

    const receivedMessagesString = localStorage.getItem('received-messages');

    if (!receivedMessagesString) return;

    const userReceivedMessages = JSON.parse(receivedMessagesString).filter(
      (message) => message.author === selectedUserName
    );

    populateRecieved(userReceivedMessages);

    const sentMessagesString = localStorage.getItem('sent-messages');

    if (!sentMessagesString) return;

    const userSentMessages = JSON.parse(sentMessagesString).filter(
      (message) => message.to === selectedUserName
    );

    setSentMessages(userSentMessages);
  }, [selectedUserName]);

  useEffect(() => {

    async function populateRecieved(data) {

      const dataView = await verifyMessages(data);
      setReceivedMessages([...receivedMessagesRef.current, dataView]);

    }

    if (!selectedUserId) return;

    if (conn) return;

    const foundConn = connections.find(
      (connection) => connection.peer === selectedUserId
    );

    if (foundConn) {
      setConn(foundConn);

      foundConn.on('data', async function (data) {
        populateRecieved(data);
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

          populateRecieved(data);

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

  const sendMyMessage = async () => {
    if (!myMessage) return;

    const contact = contacts.find((user) => user.username === selectedUserName);

    let contactPublicEncKey = contact.publicEncKey;
    contactPublicEncKey = await importRsaEncKey(contactPublicEncKey, 'spki', 'encrypt');

    let keys = localStorage.getItem('keys');
    keys = JSON.parse(keys);
    const myPrivateSignKeyPEM = keys.privateKeySignPEM;
    const myPrivateSignKey = await importRsaSignKey(myPrivateSignKeyPEM, 'pkcs8', 'sign');


    let enc = new TextEncoder();
    let encMessage = enc.encode(myMessage);

    const signature = await window.crypto.subtle.sign(
      {
        name: 'RSASSA-PKCS1-v1_5',
      },
      myPrivateSignKey, //from generateKey or importKey above
      encMessage //ArrayBuffer of data you want to sign
    );

    const toSendSignature = ab2str(signature);

    const encryptedMessage = await window.crypto.subtle.encrypt(
      {
        name: 'RSA-OAEP'
      },
      contactPublicEncKey,
      encMessage
    );

    console.log('encrypted message');
    console.log(encryptedMessage);


    //const encodedEncryptedMessage = enc.encode(encryptedMessage);
    const toSendEncodedEncryptedMessage = ab2str(encryptedMessage);

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
      message: toSendEncodedEncryptedMessage,
      signature: toSendSignature,
      author: localStorage.getItem('username') || '',
      to: selectedUserName,
    };

    console.log('conn.send(messageobject)');
    console.log(messageObject);

    conn.send(messageObject);

    const storedMsgObject = {
      timestamp: currentDate.toString(),
      message: myMessage,
      author: localStorage.getItem('username') || '',
      to: selectedUserName
    };

    setSentMessages([...sentMessages, storedMsgObject]);

    const sentMessagesString = localStorage.getItem('sent-messages');

    if (sentMessagesString) {
      const userSentMessages = JSON.parse(sentMessagesString);
      userSentMessages.push(storedMsgObject);
      localStorage.setItem('sent-messages', JSON.stringify(userSentMessages));
    } else {
      localStorage.setItem('sent-messages', JSON.stringify([storedMsgObject]));
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
                content={message.message}
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
