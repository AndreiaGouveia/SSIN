import React, { useEffect, useState } from 'react';
import {
  BrowserRouter, Route, Switch,
} from 'react-router-dom';
import peer from './webrtc';
import HomePage from './Pages/HomePage';
import LogIn from './Pages/LogIn';
import Calculator from './Pages/Calculator';
import Messages from './Pages/Messages';
import Profile from './Pages/Profile';
import Layout from './Components/Layout';

import './App.css';

function App() {
  const [id, setId] = useState('');

  useEffect(() => {
    const conn = peer.connect(id);

    conn.on('open', function () {
      console.log('I oppened a connection!');
      // Receive messages
      conn.on('data', function (data) {
        console.log('Received', data);
      });

      // Send messages
      conn.send('Hello!');

      conn.close();
    });

    conn.on('error', function (err) {
      console.log('Sorry, could not open connection.');
      console.log(err);

      conn.close();
    });

    conn.on('close', function () {
      console.log('Connection has been closed');
    });
  }, [id]);

  return (
    <Layout>
      {/* Temporary input box */}
      <input type='text' value={id} onChange={(event) => setId(event.target.value)} />
      <BrowserRouter>
        <Switch>
          <Route exact path="/login" component={LogIn} />
          <Route exact path="/messages" component={Messages} />
          <Route exact path="/calculator" component={Calculator} />
          <Route exact path="/profile" component={Profile} />
          <Route exact path="/" component={HomePage} />
        </Switch>
      </BrowserRouter>
    </Layout>
  );
}

export default App;
