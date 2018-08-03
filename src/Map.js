import React, { Component } from 'react'
import Options from './Options'
import { getVenues } from './FoursquareAPI'
import OptionsBox from './OptionsBox'


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
      {title: 'Georgia Aquarium', location: {lat: 33.763382, lng: -84.3951098}, id: '44dbbfa8f964a520a0361fe3'/*'ChIJGQT0RX4E9YgR3EqvqXZw1_4'*/},
      {title: 'Atlanta Botanical Garden', location: {lat: 33.7905, lng: -84.3736}, id: '4a31751af964a520d7991fe3'/*'ChIJ0RXVJTgE9YgRvEWYcl5mE-Q'*/},
      {title: 'Atlanta Symphony Hall', location: {lat: 33.789158, lng: -84.384935}, id: '4ad7ae55f964a5209e0d21e3'/*'ChIJf8bUMEUE9YgRnUmVQgl_058'*/},
      {title: 'World of Coca-Cola', location: {lat: 33.7629, lng: -84.3927}, id: '4a49624ff964a5203fab1fe3'/*'ChIJ8yjI7H4E9YgRyacfAZqyAUQ'*/},
      {title: 'The Fox Theatre', location: {lat: 33.7726, lng: -84.3856}, id: '49e3b8d8f964a520bb621fe3'/*'ChIJ28DQdm8E9YgRnsZ4YZ94nRo'*/},
      {title: 'Center For Puppetry Arts', location: {lat: 33.7926066, lng: -84.3893476}, id: '4a0a672ef964a5209f741fe3'/*'ChIJ4fRXllAE9YgR6nR6SZWzinI'*/},
      {title: 'Margaret Mitchell House', location: {lat: 33.7812918, lng: -84.3844107}, id: '4b5359d3f964a520ab9827e3'/*'ChIJC26jokIE9YgR4p_yLHsSSBE'*/}
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

    // Style markers
    const defaultMarker = colorIcon('f8737e');
    const highlightedMarker = colorIcon('fff');
    function colorIcon(markerColor) {
      const markerImage = new window.google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
        '|40|_|%E2%80%A2',
        new window.google.maps.Size(21, 34),
        new window.google.maps.Point(0, 0),
        new window.google.maps.Point(10, 34),
        new window.google.maps.Size(21,34)
      );
      return markerImage;
    }
    
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
          icon: defaultMarker,
          id: position.id
        });
        // Extend the boundaries of the map for each marker
        bounds.extend(marker.position);
        // Onclick event to open an infowindow
        marker.addListener('click', () => {
          this.populateInfoWindow(marker, largeInfowindow, mapMarker);
        });
        // Style markers
        window.google.maps.event.addListener(marker, "mouseover", function() {
          marker.setIcon(highlightedMarker);
        });
        window.google.maps.event.addListener(marker, "mouseout", function() {
          marker.setIcon(defaultMarker);
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
          getVenues(marker.id)
            .then(venue => {
              const venueDetails = venue.response.venue
              const infovenue = this.venueInfo(venueDetails)
              largeInfowindow.setContent(`<div><h3>${marker.title}</h3>${infovenue}</div>`);
            })
            .catch(error => {
              largeInfowindow.setContent(`<div><h3>${marker.title}</h3><span>The request is probably valid but needs to be retried later.</span><p>${error}</p></div>`)
            })
          largeInfowindow.marker = marker;
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
  venueInfo = (venueDetails) => {
    let info = '<div class="infowindow">'
    info += venueDetails.description ? `<p>${venueDetails.description}</p>` : '';
    info += venueDetails.bestPhoto.prefix && venueDetails.bestPhoto.suffix ? `<img src="${venueDetails.bestPhoto.prefix}170x100${venueDetails.bestPhoto.suffix}" alt="Atlanta spot photo" class="infowindow-image">` : '';
    info += venueDetails.address ? `<h4>${venueDetails.address}</h4>` : '';
    info += '</div>'
    return info;
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

  query = (value) => {
    this.setState(currentState => {
      let locationFiltered = this.state.locationFiltered;
      const actualLocations = currentState.locations;
      if(value !== '') {
        locationFiltered = actualLocations.filter(position => {
          return position.title.toLowerCase().includes(value.toLowerCase());
        })
      } else {
        locationFiltered = actualLocations;
      }
      return({locationFiltered});
    });
  }

  render() {
    const markerFiltered = this.state.markers.filter(eachMarker => {
      eachMarker.setMap(null);
      // Tests whether at least one element in the array passes the test
      return this.state.locationFiltered.some(position => position.id === eachMarker.id)
    })

    return (
      <div id="container">
        <OptionsBox />
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
          query={this.query}
        />
        <div id="map"></div>
      </div>
    )
  }
}

export default Map