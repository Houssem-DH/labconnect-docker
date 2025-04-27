import React from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const LabLocationMap = ({ lat, lng }) => {
    return (
        <div className="w-full h-64">
            <MapContainer
                center={[lat, lng]} // Center map on the lab's location
                zoom={15}
                style={{ height: "100%", width: "100%" }}
                dragging={true} // Disable dragging
                doubleClickZoom={true} // Enable double-click zoom
                scrollWheelZoom={true} // Enable scroll-wheel zoom
                touchZoom={true} // Enable touch zoom
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    
                />
                <Marker position={[lat, lng]} />
            </MapContainer>
        </div>
    );
};

export default LabLocationMap;
