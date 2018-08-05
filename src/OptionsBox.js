import React, { Component } from 'react'


class OptionsBox extends Component {
  state = {

  }

  showOptions = () => {
    const hideOptions = document.querySelector(".options-box")
      hideOptions.classList.toggle('hide')
    const showOptions = document.querySelector(".options-box")
      showOptions.classList.toggle('show')
  }

  render() {
    return (
      <div className="header">
        <a tabIndex="0" 
           role="button" 
           aria-label="Collapse side panel" 
           className="icon-container" 
           onClick={() => this.showOptions()}
           onKeyDown={(event) => {
            if (event.keyCode === 13) {
              this.showOptions()
            }
          }}
        >
          <div className="icon"></div>
          <div className="icon"></div>
          <div className="icon"></div>
        </a>
        <p className="header-title" role="heading">Explore The Neighborhoods Of Atlanta</p>
      </div>
    )
  }
}

export default OptionsBox