const axios =  require('axios');
const HttpError =  require('../Models/error');

async function getCoordinatesFromAddress(address) {
  const response = await axios.get(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
  );
  const data = await response.data;

  if (!data || data.length === 0) {
    const error = new HttpError("Could not find location for the address.", 422);
    throw error;
  }

  const { lat, lon } = data[0];
  return { lat: parseFloat(lat), lng: parseFloat(lon) };
}

module.exports = getCoordinatesFromAddress
