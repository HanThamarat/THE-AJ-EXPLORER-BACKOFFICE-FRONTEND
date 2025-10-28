"use client";

import {
  APIProvider,
  Map,
  Marker,
  useMarkerRef,
  useMap // This hook must be used *inside* a child of APIProvider
} from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import { PointDTO } from "@/app/types/package";

// Define props for both components
interface MapMarkerProps {
  value: PointDTO;
  onChange: (val: PointDTO) => void;
}

function MapContent({ value, onChange }: MapMarkerProps) {
  // This hook will now find the context
  const map = useMap(); 
  const [markerPosition, setMarkerPosition] = useState<PointDTO | null>(value);
  const [markerRef, marker] = useMarkerRef();

  const handleChangeLocation = (e: google.maps.MapMouseEvent) => {
    const newPos = {
      lat: e.latLng!.lat(),
      lng: e.latLng!.lng()
    };
    onChange(newPos);
    setMarkerPosition(newPos);
  };

  useEffect(() => {
    if (navigator.geolocation && !value?.lat) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          };
          setMarkerPosition(coords);
          onChange(coords);
          // Now `map` will be defined and this will work
          map?.panTo(coords); 
        },
        (err) => {
          console.log("Geolocation error:", err);
        }
      );
    }

    if (!marker) return;
  }, [marker, map, onChange, value?.lat]);

  useEffect(() => {
    if (value) setMarkerPosition(value);
  }, [value]);

  return (
    <Map
      className="w-full h-[300px] overflow-hidden rounded-[15px]"
      center={markerPosition ?? { lat: 13.736717, lng: 100.523186 }}
      gestureHandling="greedy"
      defaultZoom={8}
      disableDefaultUI
    >
      {markerPosition && (
        <Marker
          ref={markerRef}
          position={markerPosition}
          draggable={true}
          onDrag={handleChangeLocation}
          icon={{
            url: "/marker.svg"
          }}
        />
      )}
    </Map>
  );
}

export default function MapMarker({ value, onChange }: MapMarkerProps) {
  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY as string}>
      <MapContent value={value} onChange={onChange} />
    </APIProvider>
  );
}
