import Peer from 'peerjs';

const peer = new Peer({
    host: 'localhost',
    port: 8080,
    path: '/peerjs',
    iceServers: []
});

peer.on('open', function (id) {
    console.log('My peer ID is: ' + id);
});

peer.on('connection', function (conn) {
    console.log('Someone oppened a connection!');
    // Receive messages
    conn.on('data', function (data) {
        console.log('Received', data);
    });

    conn.on('close', function () {
        console.log('Connection has been closed');
    });
});

peer.on('error', function (err) {
    if (err.type === 'peer-unavailable')
        console.log('That dude\'s offline');
});

export default peer;