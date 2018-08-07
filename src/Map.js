import React, { Component } from 'react'
import Options from './Options'
import { getVenues } from './FoursquareAPI'
import OptionsBox from './OptionsBox'
import { colorIcon } from './MarkerStyles'
import { atlanta } from './Atlanta'


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
    this.state.locations = atlanta;
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
        colorIcon();
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
              largeInfowindow.setContent(`<div aria-label="infowindow" tabIndex="2"><h3 class="location-title" tabIndex="1">${marker.title}</h3>${infovenue}</div>`);
            })
            .catch(error => {
              largeInfowindow.setContent(`<div aria-label="infowindow" class="infowindow-error" tabIndex="2"><h3 class="location-title" tabIndex="1">${marker.title}</h3><h3>Sorry,</h3><h4>an error occurred, and we were unable to load your Foursquare data.</h4><span tabIndex="1">Error: Foursquare API request is probably valid but needs to be retried later.</span></div>`)
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
    let info = '<div className="infowindow" tabIndex="2">'
    info += venueDetails.description ? `<p className="article" role="article" tabIndex="1">${venueDetails.description}</p>` : '';
    info += venueDetails.bestPhoto.prefix && venueDetails.bestPhoto.suffix ? `<img src="${venueDetails.bestPhoto.prefix}170x100${venueDetails.bestPhoto.suffix}" alt="${this.marker.title}" class="infowindow-image" tabIndex="0" role="img">` : '';
    //info += venueDetails.address ? `<h4>${venueDetails.address}</h4>` : '';
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
        <div id="map" aria-label="Neighborhoods of Atlanta Map" role="application" tabIndex="1"></div>
      </div>
    )
  }
}

export default Map