import { useEffect, useState } from "react";
import { packageEntity } from "@/app/types/package";
import { APIProvider, Map, Marker, useMapsLibrary } from "@vis.gl/react-google-maps";

interface LocationComponentProps {
  packageDetail: packageEntity;
}

function AddressInfo({ lat, lng }: { lat: number; lng: number }) {
  const geocodingLib = useMapsLibrary("geocoding");
  const [address, setAddress] = useState<string>("Loading address...");

  useEffect(() => {
    if (!geocodingLib) return;

    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        setAddress(results[0].formatted_address);
      } else {
        setAddress("Address not found");
      }
    });
  }, [geocodingLib, lat, lng]);

  return <p className="text-sm text-gray-600">{address}</p>;
}

export default function LocationComponent({ packageDetail }: LocationComponentProps) {
  const start = {
    lat: Number(packageDetail.depart_point_lat),
    lng: Number(packageDetail.depart_point_lon),
  };

  const end = {
    lat: Number(packageDetail.end_point_lat),
    lng: Number(packageDetail.end_point_lon),
  };

  return (
    <>
      <span className="text-[20px] font-semibold">Location</span>
      <div className="mt-[15px]">
        <APIProvider
          apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY as string}
          libraries={["marker", "geocoding"]}
        >
          <Map
            className="w-full h-[300px] overflow-hidden rounded-[15px]"
            center={start}
            gestureHandling="greedy"
            defaultZoom={8}
            disableDefaultUI
          >
            <Marker position={start} icon={{ url: "/marker.svg" }} />
            <Marker position={end} icon={{ url: "/marker.svg" }} />
          </Map>

          <div className="mt-3 space-y-2">
            <div>
              <strong>Depart point</strong>
              <AddressInfo lat={start.lat} lng={start.lng} />
            </div>
            <div>
              <strong>End point</strong>
              <AddressInfo lat={end.lat} lng={end.lng} />
            </div>
          </div>
        </APIProvider>
      </div>
    </>
  );
}
