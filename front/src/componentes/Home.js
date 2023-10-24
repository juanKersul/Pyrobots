import React from 'react';

const styleimg = {
  display: "block",
  justifyContent: "center",
  alignItems: "center",
  margin: "auto",
  width: "500px",
}

function Home () {
  return (
      <div>
        <img src='./homepage.png' alt="avatar-robot" style={styleimg} />
      </div>
  );
}

export default Home;