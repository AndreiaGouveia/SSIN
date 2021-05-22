import React from 'react';
import Header from '../Components/Header';
import { callApiWithToken } from '../fetch';
import { getUser } from '../auth';
import './../CSS/Profile.css';

class Profile extends React.Component {
  constructor(props) {
    super(props);

    const user = getUser();

    this.state = {
      username: user.username,
      fullName: '',
      clearanceLevel: 1
    };

    // This is useless for now, but i think that we will have states later on,
    // so ignore the warnings
  }

  async componentDidMount() {
    try {
      let result = await callApiWithToken('http://localhost:8080/user', 'POST');

      if (result.status === 200) {
        const resultJson = await result.json();
        this.setState({
          fullName: resultJson.fullName,
          clearanceLevel: resultJson.clearanceLvl
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  render() {

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
            <h1>{this.state.fullName}</h1>
            <h2>{this.state.username}</h2>
            <hr id='separator' />
            <h3>Level {this.state.clearanceLevel}</h3>
          </div>
        </div>
      </>
    );
  }
}

export default Profile;
