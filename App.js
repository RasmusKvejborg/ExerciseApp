import React, { useState, useEffect } from "react";
import MapView, { Marker, Polyline, Callout, Circle } from "react-native-maps";
import { StyleSheet, Text, View, Dimensions, Platform } from "react-native";
import * as Location from "expo-location";
import UserLocation from "./UserLocation";
import { globalStyles } from "./GlobalStyles.js";

// -------------------------------------------------

export default function App({ name, onNameChange }) {
  const [pin, setPin] = useState({
    latitude: 0,
    longitude: 0,
  });

  const [coordinates, SetCoordinates] = useState([]);

  useEffect(() => {
    (async () => {
      alert(
        // this alert should run an async itself, depending on if its first timer user has opened the app
        "Run Every Street collects location data to enable drawing of the trail you are running, even when the app is closed or not in use."
      );
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});

      setPin({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  function callbackFunction(data) {
    SetCoordinates((prevCdnates) => [
      ...prevCdnates,
      {
        latitude: data.latitude,
        longitude: data.longitude,
      },
    ]);
  }

  return (
    <View style={globalStyles.container}>
      <MapView
        style={globalStyles.map}
        region={{
          latitude: pin.latitude,
          longitude: pin.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}
        showsUserLocation={true}
      >
        <Polyline
          coordinates={coordinates}
          strokeColor="red"
          strokeColors={["#7F0000"]}
          strokeWidth={6}
        />
      </MapView>
      <UserLocation callback={callbackFunction} />
    </View>
  );
}
