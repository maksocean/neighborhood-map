import React from 'react'


const Options = (props) => {
  const {
    locations, 
    locationFiltered, 
    locationSelected, 
    selectLocation,
    query // (search-box)
  } = props;
  const items = locationFiltered === [] ? locations : locationFiltered;
  
  return (
    <div className="options-box">
      <h2 tabIndex="0">Explore The Neighborhoods Of Atlanta</h2>
      <div>
        <input className="search-box"
          aria-label="Search for locations"
          placeholder="Search"
          type="text"
          onChange={event => query(event.target.value)}
        />
      </div>    
      <div className="list-view">
        <ul className='list'
            aria-label="List of locations"
            role="tabpanel"
            tabIndex="0"> 
          {items.map((location, index) => {
            const itemSelected = (location.id === locationSelected.id ? 'selectedItem' : '');
            return (
              <li role="tab" className={itemSelected}
                key={index}
                onClick={() => selectLocation(location)}
                onKeyDown={(event) => {
                  if (event.keyCode === 13) {
                    selectLocation(location)
                  }
                }}
                tabIndex="0"
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