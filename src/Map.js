import React, { Component } from 'react'


class Map extends Component {
  getGoogleMaps() {
    // Define new promise
    if (!this.googleMapsPromise) {
      this.googleMapsPromise = new Promise((resolve) => {
        // When the API finishes loading add a global handler for it
        window.resolveGoogleMapsPromise = () => { 
          resolve(window.google);                 // resolve a promise
          delete window.resolveGoogleMapsPromise; // and clear
        };
        // Load the Google Maps API
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyD8Fn7L8lfVFU4_OK_mo2zzLQ6Zg4I14uI&v=3&callback=resolveGoogleMapsPromise`;
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
      });
    }
    return this.googleMapsPromise; // a promise for the Google Maps API
  }

  componentWillMount() {
    this.getGoogleMaps(); // start Google Maps API loading
  }

  componentDidMount() {
    this.getGoogleMaps().then(() => {
      let mapId = document.getElementById('map');
      const map = new window.google.maps.Map(mapId, { // initialize the map
        center: {lat: 33.777858, lng: -84.391240},
        zoom: 14,
      });
      this.setState({ map: map })
    });
  }

  render() {
    return (
      <div id="container">
        <div id="map"></div>
      </div>
    )
  }
}

export default Map