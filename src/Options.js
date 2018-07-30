import React from 'react'


function Options (props) {

  const listView = props.listItems.map((item) =>
    <li key={item.toString()}>
      {item}
    </li>
  );

  return (
    <div className="options-box">
      <h2>Explore The Neighborhoods Of Atlanta</h2>
      <div className="list-view">
        <ul className='list' key='id'>{listView}</ul>
      </div>
    </div>
  )
  
}


export default Options