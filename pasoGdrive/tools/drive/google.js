
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { Client } from '@googlemaps/google-maps-services-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });
const api_key = process.env.GOOGLE_MAPS_API_KEY;

const gmaps = new Client({});

export async function getTravelTime(origin, destination, travel_mode = 'driving', arrival_time = null) {
  const params = {
    origin,
    destination,
    mode: travel_mode.toLowerCase(),
    key: api_key,
  };
  if (arrival_time) params.arrival_time = arrival_time;

  const result = await gmaps.directions({ params });
  const directions = result.data.routes;
  if (!directions || directions.length === 0) {
    throw new Error('No route found');
  }
  const leg = directions[0].legs[0];
  const response = {
    origin: leg.start_address,
    destination: leg.end_address,
    travel_mode,
    duration_text: leg.duration.text,
    duration_seconds: leg.duration.value,
  };
  console.log(response);
  return response;
}

export async function getAddressFromCoordinates(latitude, longitude) {
  const params = {
    latlng: `${latitude},${longitude}`,
    key: api_key,
  };
  const result = await gmaps.reverseGeocode({ params });
  const reverse_geocode_result = result.data.results;
  if (!reverse_geocode_result || reverse_geocode_result.length === 0) {
    throw new Error('No address found for the given coordinates');
  }
  return reverse_geocode_result[0].formatted_address;
}

export async function getCoordinatesFromAddress(address) {
  const params = {
    address,
    key: api_key,
  };
  const result = await gmaps.geocode({ params });
  const geocode_result = result.data.results;
  if (!geocode_result || geocode_result.length === 0) {
    throw new Error('No coordinates found for the given address');
  }
  const location = geocode_result[0].geometry.location;
  return [location.lat, location.lng];
}
