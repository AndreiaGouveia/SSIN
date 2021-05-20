import React from 'react';
import Header from '../Components/Header';

function HomePage() {
  return (
    <>
      <Header />
      <div style={{ marginTop: '8vmax', paddingLeft: '8vmax' }}>
        <h1 style={{ color: 'white', fontWeight: 'bold', fontSize: '7vmax' }}>
          Secure
        </h1>
        <h1 style={{ color: 'white', fontWeight: 'bold', fontSize: '7vmax' }}>
          Connection
        </h1>
        <h3
          style={{ color: '#ececec', fontSize: '2vmax', paddingTop: '0.5vmax' }}
        >
          Expertise. Commitment. Value
        </h3>
      </div>
    </>
  );
}

export default HomePage;
