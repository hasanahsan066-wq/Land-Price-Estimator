import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Layers, Maximize2, Compass, Eye } from 'lucide-react';
import { convertToAcres } from '../utils/valuationEngine';
import { LandUnit } from '../types';

// Fix Leaflet icon issue with custom DivIcon
const createCustomPinIcon = () => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background: linear-gradient(135deg, #10b981, #059669);
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4), 0 0 0 3px rgba(255, 255, 255, 0.9);
      ">
        <div style="
          width: 10px;
          height: 10px;
          background: white;
          border-radius: 50%;
          transform: rotate(45deg);
        "></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

interface MapEventsHandlerProps {
  onLocationSelect: (lat: number, lng: number) => void;
}

function MapEventsHandler({ onLocationSelect }: MapEventsHandlerProps) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom());
  }, [lat, lng, map]);
  return null;
}

interface LandMapProps {
  lat: number;
  lng: number;
  size: number;
  unit: LandUnit;
  locationName: string;
  onLocationChange: (lat: number, lng: number) => void;
  className?: string;
}

export const LandMap: React.FC<LandMapProps> = ({
  lat,
  lng,
  size,
  unit,
  locationName,
  onLocationChange,
  className = 'h-80 w-full'
}) => {
  const [mapType, setMapType] = useState<'streets' | 'satellite' | 'topography'>('satellite');

  // Compute bounding polygon square for parcel visualization based on area size in sq meters
  const acres = convertToAcres(size, unit);
  const sqMeters = acres * 4046.86;
  const sideLengthMeters = Math.sqrt(sqMeters);

  // Approximate degree offsets (1 deg lat approx 111,000 meters)
  const latOffset = (sideLengthMeters / 2) / 111000;
  const lngOffset = (sideLengthMeters / 2) / (111000 * Math.cos((lat * Math.PI) / 180));

  const polygonCoords: [number, number][] = [
    [lat + latOffset, lng - lngOffset],
    [lat + latOffset, lng + lngOffset],
    [lat - latOffset, lng + lngOffset],
    [lat - latOffset, lng - lngOffset],
  ];

  const getTileUrl = () => {
    switch (mapType) {
      case 'satellite':
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      case 'topography':
        return 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
      default:
        return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    }
  };

  const getAttribution = () => {
    switch (mapType) {
      case 'satellite':
        return 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
      case 'topography':
        return 'Map data: &copy; OpenStreetMap contributors, SRTM | Map style: &copy; OpenTopoMap (CC-BY-SA)';
      default:
        return '&copy; OpenStreetMap contributors';
    }
  };

  return (
    <div className={`relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl ${className}`}>
      {/* Map Control Bar Overlay */}
      <div className="absolute top-3 right-3 z-[1000] flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/80 shadow-lg text-xs font-medium text-slate-200">
        <button
          type="button"
          onClick={() => setMapType('satellite')}
          className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
            mapType === 'satellite'
              ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
              : 'hover:bg-slate-800 text-slate-300'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          Satellite
        </button>
        <button
          type="button"
          onClick={() => setMapType('streets')}
          className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
            mapType === 'streets'
              ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
              : 'hover:bg-slate-800 text-slate-300'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          Streets
        </button>
        <button
          type="button"
          onClick={() => setMapType('topography')}
          className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
            mapType === 'topography'
              ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
              : 'hover:bg-slate-800 text-slate-300'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          Topo
        </button>
      </div>

      {/* Parcel Information Overlay */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-slate-950/85 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-800 shadow-md text-xs text-slate-300 flex items-center gap-3">
        <div className="flex items-center gap-1.5 font-medium text-emerald-400">
          <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="truncate max-w-[200px]">{locationName}</span>
        </div>
        <div className="h-3 w-px bg-slate-700" />
        <span className="text-slate-400">
          Approx. Lot Perimeter: <strong className="text-slate-200">{(sideLengthMeters * 4).toFixed(0)}m</strong>
        </span>
      </div>

      <MapContainer
        center={[lat, lng]}
        zoom={15}
        scrollWheelZoom={false}
        className="h-full w-full bg-slate-950 z-0"
      >
        <TileLayer url={getTileUrl()} attribution={getAttribution()} />
        <RecenterMap lat={lat} lng={lng} />
        <MapEventsHandler onLocationSelect={onLocationChange} />

        {/* Dynamic Parcel Polygon Outline */}
        <Polygon
          positions={polygonCoords}
          pathOptions={{
            color: '#10b981',
            fillColor: '#10b981',
            fillOpacity: 0.25,
            weight: 2,
            dashArray: '4, 4'
          }}
        />

        {/* Interactive Pin Marker */}
        <Marker
          position={[lat, lng]}
          icon={createCustomPinIcon()}
          draggable={true}
          eventHandlers={{
            dragend: (e) => {
              const marker = e.target;
              const position = marker.getLatLng();
              onLocationChange(position.lat, position.lng);
            },
          }}
        >
          <Popup className="custom-popup">
            <div className="p-1 text-slate-900 font-sans">
              <p className="font-bold text-sm text-emerald-700">{locationName}</p>
              <p className="text-xs text-slate-600 mt-0.5">
                Area: {size} {unit} ({acres.toFixed(2)} Acres)
              </p>
              <p className="text-[10px] text-slate-500 mt-1 italic">Drag pin or click map to relocate parcel center</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};
