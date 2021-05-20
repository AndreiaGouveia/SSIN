import React from 'react';
import {
  BrowserRouter, Route, Switch,
} from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';
import HomePage from './Pages/HomePage';
import LogIn from './Pages/LogIn';
import Calculator from './Pages/Calculator';
import Messages from './Pages/Messages';
import Profile from './Pages/Profile';
import { getUser } from './auth.js';
import './App.css';

function App() {
  return (
    <ToastProvider>
        <BrowserRouter>
          <Switch>
            {getUser().username === null ? (
              <>
                <Route exact path='/login' component={LogIn} />{' '}
                <Route exact path='/' component={HomePage} />
              </>
            ) : (
              <>
                <Route exact path='/messages' component={Messages} />
                <Route exact path='/calculator' component={Calculator} />
                <Route exact path='/profile' component={Profile} />
                <Route exact path='/' component={HomePage} />
              </>
            )}
          </Switch>
        </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
