import React from 'react';
import Header from '../Components/Header';
import { getUser } from '../auth';
import './../CSS/Profile.css';

class Profile extends React.Component {
  constructor(props) {
    super(props);

    // This is useless for now, but i think that we will have states later on,
    // so ignore the warnings
  }

  render() {
    const user = getUser();

    return (
      <>
        <Header />
        <div id='container'>
          <div style={{ marginTop: '8vmax', paddingLeft: '8vmax' }}>
            <h1
              style={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: '7vmax',
              }}
            >
              Secure
            </h1>
            <h1
              style={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: '7vmax',
              }}
            >
              Connection
            </h1>
            <h3
              style={{
                color: '#ececec',
                fontSize: '2vmax',
                paddingTop: '0.5vmax',
              }}
            >
              Expertise. Commitment. Value
            </h3>
          </div>

          <div id='profile'>
            <h1>{user.username}</h1>
            <h2>{user.username}</h2>
            <hr id='separator' />
            <h3>Level #</h3>
          </div>
        </div>
      </>
    );
  }
}

export default Profile;
