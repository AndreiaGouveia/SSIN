import Peer from 'peerjs';

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
            console.log('Received', data);
            // TODO: store message in session storage
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

peer.on('open', function (id) {
    console.log('My peer ID is: ' + id);
    // TODO: tell server my ID

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
