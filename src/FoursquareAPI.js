const clientID = 'EIOXNMK2QDW4P2BSZHGCQOYE21VSQJZKWL1PHJGJRGUIUOEM'
const clientSecret = 'P3GLZUJYTFWCUSGAPJTAZCYSWZTWXHQML0TU2OVOQXWYR3FJ'
const v = '20180801'

function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

export const getVenues = (venue) =>
fetch(`https://api.foursquare.com/v2/venues/${venue}?client_id=${clientID}&client_secret=${clientSecret}&v=${v}`)
  .then(handleErrors)
  .then(response => console.log("ok"))
  .then(data => data.response.venue)
  .catch(error => console.log(error));