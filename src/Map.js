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
        center: {lat: 33.7774953, lng: -84.3841777},
        zoom: 14,
      });
      // Markers -------------------------------------------------------------------------
      const markers = [];
      const locations = [
        {title: 'Georgia Aquarium', location: {lat: 33.763382, lng: -84.3951098}},
        {title: 'Atlanta Botanical Garden', location: {lat: 33.7905, lng: -84.3736}},
        {title: 'Atlanta Symphony Orchestra', location: {lat: 33.789158, lng: -84.384935}},
        {title: 'World of Coca-Cola', location: {lat: 33.7629, lng: -84.3927}},
        {title: 'The Fox Theatre', location: {lat: 33.7726, lng: -84.3856}},
        {title: 'Center For Puppetry Arts', location: {lat: 33.7926066, lng: -84.3893476}},
        {title: 'Margaret Mitchell House', location: {lat: 33.7812918, lng: -84.3844107}}
      ];
      const locationsNewArray = locations.map(function (position) {
        const title = position.title
        const markerPosition = position.location
        const marker = new window.google.maps.Marker({
          map: map,
          position: markerPosition,
          title: title,
          animation: window.google.maps.Animation.DROP
        });
        // Push the marker to the array of markers
        markers.push(marker);
      })
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