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
        <a className="icon-container" onClick={() => this.showOptions()}>
          <div className="icon"></div>
          <div className="icon"></div>
          <div className="icon"></div>
        </a>
        <p className="header-title">Explore The Neighborhoods Of Atlanta</p>
      </div>
    )
  }
}

export default OptionsBox