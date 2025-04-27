import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const LocationPicker = ({ onLocationSelect = () => {} }) => {
  // Hard-coding the latitude and longitude directly
  const [position, setPosition] = useState([34.95799531086792, 3.1640625000000004]); // New York City coordinates
  console.log(position);
  

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]); // Update the position state with clicked location
        onLocationSelect({ lat, lng }); // Pass the updated location to parent component
      },
    });
    return null;
  };

  return (
    <MapContainer
      center={position}
      zoom={10}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={position} />
      <MapClickHandler />
    </MapContainer>
  );
};

export default LocationPicker;
