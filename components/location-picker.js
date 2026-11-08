'use client';

import { useEffect, useState } from 'react';
import { CircleMarker, MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet';

function MapClickHandler({ onPick }) {
  useMapEvents({ click(event) { onPick(event.latlng); } });
  return null;
}

function MapRecentre({ location }) {
  const map = useMap();
  useEffect(() => {
    if (location) map.flyTo([location.lat, location.lng], Math.max(map.getZoom(), 12), { duration: 0.8 });
  }, [location, map]);
  return null;
}

export default function LocationPicker({ location, onPick }) {
  const [locationError, setLocationError] = useState('');
  const useCurrentLocation = () => {
    if (!navigator.geolocation) { setLocationError('This browser does not support location access.'); return; }
    setLocationError('');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => onPick({ lat: coords.latitude, lng: coords.longitude }),
      () => setLocationError('Location access was not granted. You can still place the pin on the map.'),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  };
  return <div className="map-picker" aria-label="Map of Kerala. Click to choose an event location.">
    <div className="map-caption">OPENSTREETMAP · KERALA</div>
    <button type="button" className="current-location-button" onClick={useCurrentLocation}>⌖ USE MY CURRENT LOCATION</button>
    <MapContainer center={[10.35, 76.28]} zoom={8} minZoom={7} zoomControl={false} maxBounds={[[7.75, 74.55], [12.95, 77.75]]} maxBoundsViscosity={1} scrollWheelZoom className="kerala-map">
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapClickHandler onPick={onPick} />
      <MapRecentre location={location} />
      {location && <CircleMarker center={[location.lat, location.lng]} radius={10} pathOptions={{ color: '#111', weight: 3, fillColor: '#f04b16', fillOpacity: 1 }} />}
    </MapContainer>
    <span className="map-help">Click the map to place your location pin{locationError && ` · ${locationError}`}</span>
  </div>;
}
