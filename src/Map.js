import React, { Component } from 'react'
import Options from './Options'


class Map extends Component {
  state = {
    mapState: {},
    markers: [],
    largeInfowindow: {},
    locations: [],
    locationSelected: '',
    locationFiltered: []
  }

  constructor(props) {
    super(props);
    this.state.locations = [
      {title: 'Georgia Aquarium', location: {lat: 33.763382, lng: -84.3951098}, id: 'ChIJGQT0RX4E9YgR3EqvqXZw1_4'},
      {title: 'Atlanta Botanical Garden', location: {lat: 33.7905, lng: -84.3736}, id: 'ChIJ0RXVJTgE9YgRvEWYcl5mE-Q'},
      {title: 'Atlanta Symphony Orchestra', location: {lat: 33.789158, lng: -84.384935}, id: 'ChIJf8bUMEUE9YgRnUmVQgl_058'},
      {title: 'World of Coca-Cola', location: {lat: 33.7629, lng: -84.3927}, id: 'ChIJ8yjI7H4E9YgRyacfAZqyAUQ'},
      {title: 'The Fox Theatre', location: {lat: 33.7726, lng: -84.3856}, id: 'ChIJ28DQdm8E9YgRnsZ4YZ94nRo'},
      {title: 'Center For Puppetry Arts', location: {lat: 33.7926066, lng: -84.3893476}, id: 'ChIJ4fRXllAE9YgR6nR6SZWzinI'},
      {title: 'Margaret Mitchell House', location: {lat: 33.7812918, lng: -84.3844107}, id: 'ChIJC26jokIE9YgR4p_yLHsSSBE'}
    ];
    this.state.locationFiltered = this.state.locations;
  }

  componentWillMount() {
    const script = document.createElement("script"); // don't forget about callback
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyD8Fn7L8lfVFU4_OK_mo2zzLQ6Zg4I14uI&v=3&callback=getGoogleMaps`;
      script.async = true;
      script.defer = true;
    document.body.appendChild(script);
    window.getGoogleMaps = this.getGoogleMaps; // start Google Maps API loading
  }

  // Initialize the map
  getGoogleMaps = () => {
    let mapId = document.getElementById('map');
    const mapGoogle = new window.google.maps.Map(mapId, { 
      center: {lat: 33.7774953, lng: -84.3841777},
      zoom: 14
    });
    // Create infowindow
    const largeInfowindow = new window.google.maps.InfoWindow({
    });
    // Adjust the boundaries of the map
    const bounds = new window.google.maps.LatLngBounds();
    
    // Our Markers
    this.setState({mapState: mapGoogle}, (() => {
      const locations = this.state.locations;
      const mapMarker = this.state.mapState
      const markers = locations.map((position) => {
        const title = position.title
        const markerPosition = position.location
        const marker = new window.google.maps.Marker({
          map: mapMarker,
          position: markerPosition,
          title: title,
          animation: window.google.maps.Animation.DROP,
          id: position.id
        });
        // Extend the boundaries of the map for each marker
        bounds.extend(marker.position);
        // Onclick event to open an infowindow
        marker.addListener('click', () => {
          this.populateInfoWindow(marker, largeInfowindow, mapMarker);
        });
        return marker
      });
        mapMarker.fitBounds(bounds);
        this.setState({ markers })
    }))

    // Our Infowindows
    this.setState({largeInfowindow}, (() =>
      this.populateInfoWindow = (marker, largeInfowindow, mapMarker) => {
        // Check if the infowindow is not already opened on this marker
        if (largeInfowindow.marker !== marker) {
          largeInfowindow.marker = marker;
          largeInfowindow.setContent('<div>' + marker.title + '</div>');
          // Close the "previous" infowindow
          largeInfowindow.close();
          largeInfowindow.open(mapMarker, marker);
          // Close the current infowindow
          largeInfowindow.addListener('closeclick', function() {
            largeInfowindow.marker = null;
          });
        }
      }
    ))
  }

  // Select option
  selectLocation = (location) => {
    if (location.id === this.state.locationSelected.id) {
      this.setState({locationSelected: ''});
    } else {
      this.setState({locationSelected: location});
    }
  }
  itemSelected = (marker) => {
    const selectedLocation = this.state.locationSelected;
    if(marker.id === selectedLocation.id) {
      this.populateInfoWindow(marker, this.state.largeInfowindow, this.state.mapState);
      return window.google.maps.Animation.BOUNCE
    }
    return null
  }

  render() {
    const markerFiltered = this.state.markers.filter(eachMarker => {
      eachMarker.setMap(null);
      // Tests whether at least one element in the array passes the test
      return this.state.locationFiltered.some(position => position.id === eachMarker.id)
    })

    return (
      <div id="container">
        {
          markerFiltered.forEach(eachMarker => {
            // Add the marker to the map directly
            eachMarker.setMap(this.state.mapState);
            // Initiate an animation on an existing marker
            eachMarker.setAnimation(this.itemSelected(eachMarker));
          })
        }
        <Options 
          locations={this.state.locations}
          locationSelected={this.state.locationSelected}
          locationFiltered={this.state.locationFiltered}
          selectLocation={this.selectLocation}
        />
        <div id="map"></div>
      </div>
    )
  }
}

export default Map