import React from 'react';
import {
  BrowserRouter, Route, Switch,
} from 'react-router-dom';
import HomePage from './Pages/HomePage';
import LogIn from './Pages/LogIn';
import Calculator from './Pages/Calculator';
import Messages from './Pages/Messages';
import Profile from './Pages/Profile';
import Layout from './Components/Layout';

import './App.css';

function App() {
  return (
    <Layout>
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
