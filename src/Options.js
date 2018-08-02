import React from 'react'


const Options = (props) => {
  const {
    locations, 
    locationFiltered, 
    locationSelected, 
    selectLocation
  } = props;
  const items = locationFiltered === [] ? locations : locationFiltered;
  
  return (
    <div className="options-box">
      <h2>Explore The Neighborhoods Of Atlanta</h2>
      <div className="list-view">
        <ul className='list'> 
          {items.map((location, index) => {
            const itemSelected = (location.id === locationSelected.id ? 'selectedItem' : '');
            return (
              <li className={itemSelected}
                key={index}
                onClick={() => selectLocation(location)}
              >
                {location.title}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default Options