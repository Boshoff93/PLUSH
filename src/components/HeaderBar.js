import React from 'react';

const HeaderBar = () => (
  <div className='ui huge top attached fluid secondary menu'>
    <div className='item'/>
    <div className='item '>
      <h1
        className='ui orange header'
        style={{ marginTop: '10px', fontFamily:'Risque' }}
      >
        PLUSH
      </h1>
      <img style={{margin: "0 auto 12px"}} src={require("../Images/Plush_Narwall.png")}></img>
    </div>

  </div>
);

export default HeaderBar;
