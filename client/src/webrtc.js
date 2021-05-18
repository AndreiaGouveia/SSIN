import Peer from 'peerjs';
import { callApiWithToken } from './fetch';

// Keeps track of current connections
export const connections = [];

const sessionPeerId = sessionStorage.getItem('webrtc-peer');
const peerOptions = {
    host: 'localhost',
    port: 8080,
    path: '/peerjs',
    iceServers: []
};

// Connect to server with new ID or previous ID (if it exists)
export const peer = sessionPeerId ? new Peer(sessionPeerId, peerOptions) : new Peer(peerOptions);

/**
 * Save current connections to session storage
 */
const storeSessionConnections = () => {
    sessionStorage.setItem('webrtc-connections', JSON.stringify(connections.map(connection => { return { peer_id: connection.peer }; })));
};

/**
 * Add new connection to list of current connections
 * @param {*} conn 
 */
export const addConnection = (conn, setListener = true) => {
    if (!conn)
        return;

    console.log('New connection');
    connections.push(conn);
    storeSessionConnections();

    if (setListener) {
        conn.on('data', function (data) {
            const receivedMessagesString = localStorage.getItem('received-messages');

            if (receivedMessagesString) {
                const userReceivedMessages = JSON.parse(receivedMessagesString);
                userReceivedMessages.push(data);
                localStorage.setItem('received-messages', JSON.stringify(userReceivedMessages));
            } else {
                localStorage.setItem('received-messages', JSON.stringify([data]));
            }

            // TODO: show notification
        });
    }

    conn.on('close', function () {
        console.log('Connection has been closed');
        const connIndex = connections.indexOf(conn);
        if (connIndex !== -1) {
            connections.splice(connIndex, 1);
            storeSessionConnections();
        }
    });
};

peer.on('open', async function (id) {
    console.log('My peer ID is: ' + id);
    
    let registered = sessionPeerId ? true : false;
    let i = 0;

    while (!registered && i < 2) {
        const names = ['Filipe Barbosa', 'Um Gajo'];
        const usernames = ['FilipeBarbosa', 'UmGajo'];

        try {
            const result = await callApiWithToken('http://localhost:8080/chat/register', null, 'POST',
                {
                    chat_id: id,
                    name: names[i],
                    username: usernames[i]
                });

            if (result.status === 200) {
                console.log(`Registered with username ${usernames[i]}`);
                registered = true;
            } else {
                i++;
            }
        } catch (err) {
            i++;
        }
    }

    // Store ID in session storage for later reload
    sessionStorage.setItem('webrtc-peer', id);

    // Restore connections
    const sessionConnectionsString = sessionStorage.getItem('webrtc-connections');

    if (sessionConnectionsString) {
        const sessionConnections = JSON.parse(sessionConnectionsString);

        sessionConnections.map(connection => addConnection(peer.connect(connection.peed_id)));
    }
});

// Someone created a connection with us
peer.on('connection', addConnection);

peer.on('error', function (err) {
    if (err.type === 'peer-unavailable')
        console.log('That dude\'s offline');
});
