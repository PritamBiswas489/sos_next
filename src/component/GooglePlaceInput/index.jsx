import React, { useRef } from "react";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";

const libraries = ["places"];

const GooglePlaceInput = ({ onPlaceSelected, children }) => {
  const autocompleteRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const onLoad = (autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();

    if (!place || !place.geometry) return;

    const latitude = place.geometry.location.lat();
    const longitude = place.geometry.location.lng();

    const address = place.formatted_address || "";

    const phoneNumber =
      place.formatted_phone_number ||
      place.international_phone_number ||
      "";

    const serviceType =
      place.types?.find((type) =>
        [
          "hospital",
          "police",
          "fire_station",
          "pharmacy",
          "doctor",
          "health",
        ].includes(type)
      ) || place.types?.[0] || "";

    const data = {
      locationName: place.name || "",
      latitude,
      longitude,
      address,
      phoneNumber,
      placeId: place.place_id,
      serviceType,
    };

    onPlaceSelected(data);
  };

  if (!isLoaded) return children;

  return (
    <Autocomplete
      onLoad={onLoad}
      onPlaceChanged={handlePlaceChanged}
      options={{
        fields: [
          "name",
          "formatted_address",
          "geometry",
          "place_id",
          "types",
          "formatted_phone_number",
          "international_phone_number",
        ],
      }}
    >
      {children}
    </Autocomplete>
  );
};

export default GooglePlaceInput;