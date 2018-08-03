const clientID = 'EIOXNMK2QDW4P2BSZHGCQOYE21VSQJZKWL1PHJGJRGUIUOEM'
const clientSecret = 'P3GLZUJYTFWCUSGAPJTAZCYSWZTWXHQML0TU2OVOQXWYR3FJ'
const v = '20180801'


export const getVenues = (venue) =>
fetch(`https://api.foursquare.com/v2/venues/${venue}?client_id=${clientID}&client_secret=${clientSecret}&v=${v}`)
  .then(response => response.json())
  .then(data => data)
  .catch(error => console.log('Failed to get venues', error))