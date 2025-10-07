import {
  APIProvider,
  Map,
  Marker,
  useMarkerRef,
  useMap
} from '@vis.gl/react-google-maps';
import { useEffect, useState } from 'react';

interface MapMarkerProps {
    onDrang: (e: { lat: number, lng: number }) => void;
}

export interface MapMarkerPropsType {
    lat: number;
    lng: number;
}

export default function MapMarker({
    onDrang
}: MapMarkerProps) {

    const map = useMap();
    const [markerPosition, setMarkerPosition] = useState<{ lat: number, lng: number } | null>(null);
    const [markerRef, marker] = useMarkerRef();

    const handleChangeLocation = (e: any) => {
        console.log(e);
        
        const newPos = {
            lat: e.latLng!.lat(),
            lng: e.latLng!.lng(),
        };

        onDrang(newPos);
        setMarkerPosition(newPos);
    }

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                const coords = {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                };
                setMarkerPosition(coords);
                map?.panTo(coords);
            }, (err) => {
                console.log("Geolocation error:", err);
            });
        } else {
            console.error("Geolocation not supported by this browser.");
        }

        if (!marker) {
        return;
        }
    }, [marker, map]);

    return(
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY as string}>
            <Map
            className="w-full h-[300px] overflow-hidden rounded-[15px]"
            center={markerPosition}
            gestureHandling='greedy'
            defaultZoom={8}
            disableDefaultUI
            >
                <Marker
                    ref={markerRef} 
                    position={markerPosition}
                    draggable={true}
                    onDrag={handleChangeLocation}
                    icon={{
                        url: '/marker.svg',
                    }}
                />
            </Map>
        </APIProvider>
    );
}