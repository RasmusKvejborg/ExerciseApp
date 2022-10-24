import React from "react";

const { useState } = React;

export default function CoordinatesManager() {
  const [coordinates, SetCoordinates] = useState([]);

  function updateCoordinates(data) {
    SetCoordinates((prevCdnates) => [
      ...prevCdnates,
      {
        latitude: data.latitude, // appends lat to the list of coordinates (it appends it to prevCdnates).
        longitude: data.longitude, // appends longitude to the list of coordinates.
      },
    ]);
  }

  return [coordinates, updateCoordinates];
}
