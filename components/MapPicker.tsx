'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface MapPickerProps {
  latitude?: number | null;
  longitude?: number | null;
  onSelect: (lat: number, lng: number, address: string) => void;
}

const DEFAULT_CENTER: [number, number] = [-13.9626, 33.7741]; // Lilongwe, Malawi

export default function MapPicker({ latitude, longitude, onSelect }: MapPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const start: [number, number] = latitude && longitude ? [latitude, longitude] : DEFAULT_CENTER;
    const map = L.map(containerRef.current).setView(start, latitude && longitude ? 15 : 7);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    async function reverseGeocode(lat: number, lng: number) {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const data = await res.json();
        onSelect(lat, lng, data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`);
      } catch {
        onSelect(lat, lng, `${lat.toFixed(5)}, ${lng.toFixed(5)}`);
      }
    }

    function placeMarker(lat: number, lng: number) {
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        markerRef.current = L.marker([lat, lng], { draggable: true }).addTo(map);
        markerRef.current.on('dragend', () => {
          const pos = markerRef.current!.getLatLng();
          reverseGeocode(pos.lat, pos.lng);
        });
      }
      reverseGeocode(lat, lng);
    }

    map.on('click', (e: L.LeafletMouseEvent) => placeMarker(e.latlng.lat, e.latlng.lng));

    if (latitude && longitude) placeMarker(latitude, longitude);

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  return <div ref={containerRef} className="relative isolate h-64 w-full overflow-hidden rounded-lg border border-tint" />;
}