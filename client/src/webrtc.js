import Peer from 'peerjs';
import { getUser } from './auth';
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

export let peer;

/**
 * Save current connections to session storage
 */
const storeSessionConnections = () => {
    sessionStorage.setItem('webrtc-connections', JSON.stringify(connections.map(connection => { return { peer_id: connection.peer }; })));
};

/**
 * Remove connection from list of current connections
 * @param {*} conn 
 */
export const removeConnection = (conn) => {
    console.log('Connection has been closed');
    const connIndex = connections.indexOf(conn);
    if (connIndex !== -1) {
        connections.splice(connIndex, 1);
        storeSessionConnections();
    }
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
        removeConnection(conn);
    });
};


// Connect to server with new ID or previous ID (if it exists)
if (getUser().username !== null) {
    peer = sessionPeerId ? new Peer(sessionPeerId, peerOptions) : new Peer(peerOptions);


    peer.on('open', async function (id) {
        console.log('My peer ID is: ' + id);

        if (!sessionPeerId) {
            try {
                const result = await callApiWithToken('https://localhost:8080/update_connection', 'POST',
                    {
                        socket: id
                    });

                if (result.status !== 200) {
                    console.log('update_conn error');
                    console.log(result.status);
                } else {
                    console.log(result);
                }
            } catch (err) {
                console.log('update_conn error');
                console.log(err);
            }
        }

        // Store ID in session storage for later reload
        sessionStorage.setItem('webrtc-peer', id);

        // Restore connections
        const sessionConnectionsString = sessionStorage.getItem('webrtc-connections');

        if (sessionConnectionsString) {
            const sessionConnections = JSON.parse(sessionConnectionsString);

            sessionConnections.map(connection => {
                const connect = peer.connect(connection.peed_id);

                connect.on('open', function () {
                    addConnection(connect);
                });
            });
        }
    });

    // Someone created a connection with us
    peer.on('connection', addConnection);

    peer.on('error', function (err) {
        if (err.type === 'peer-unavailable')
            console.log('That dude\'s offline');
    });

}
