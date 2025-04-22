import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect } from "react";

function ResetMapView({ center }) {
  const map = useMap();

  useEffect(() => {
    map.invalidateSize();
    map.setView(center);
  }, [map, center]);

  return null;
}

export default function Map({ center, zoom }) {
  return (
    <div className="w-full h-96 rounded-xl overflow-hidden shadow-lg">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        className="h-full w-full z-10"
      >
        <ResetMapView center={center} />
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={center}>
          <Popup>This is your location!</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
