import React, { useState, useEffect } from "react";
import MapView, { Marker, Polyline, Callout, Circle } from "react-native-maps";
import { StyleSheet, Text, View, Dimensions, Platform } from "react-native";
import * as Location from "expo-location";
import UserLocation from "./UserLocation";
import { globalStyles } from "./GlobalStyles.js";

const silkeborg = {
  latitude: 56.2639,
  longitude: 9.5018,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};
const silkeborg2 = {
  latitude: 56.2639,
  longitude: 9.5018,
};
const midtbyen = {
  latitude: 56.157,
  longitude: 10.2056,
};
const nord = {
  latitude: 56.1661,
  longitude: 10.2034,
};
const vest = {
  latitude: 56.1549,
  longitude: 10.1871,
};
const syd = {
  latitude: 56.1441,
  longitude: 10.2035,
};
const Ø = {
  latitude: 56.165,
  longitude: 10.2303,
};
const havn = {
  latitude: 56.1511,
  longitude: 10.2154,
};
const SanFrancisco = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.015,
  longitudeDelta: 0.0121,
};

// -------------------------------------------------

export default function App({ name, onNameChange }) {
  const [pin, setPin] = useState({
    latitude: 0,
    longitude: 0,
  });

  useEffect(() => {
    (async () => {
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

  //---------------------This is trying to make the Markers a different color when going close to them -------------------------

  const [color, setColor] = useState("orange");

  //--------------this is only used for the red polygon in the app-----------------------
  const [coordinates] = useState([
    {
      latitude: pin.latitude,
      longitude: pin.longitude,
    },
    {
      latitude: silkeborg.latitude,
      longitude: 40.3361663,
    },
  ]);
  // -----------------------------------------------------------------------------

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
        <MapView.Marker
          pinColor={color}
          coordinate={pin}
          title={"title"}
          description={"description"}
        />

        <MapView.Marker
          pinColor={color}
          coordinate={nord}
          title={"title"}
          description={"description"}
        />
        <MapView.Marker
          pinColor={color}
          coordinate={vest}
          title={"title"}
          description={"description"}
        />
        <MapView.Marker
          pinColor={color}
          coordinate={syd}
          title={"title"}
          description={"description"}
        />
        <MapView.Marker
          pinColor={color}
          coordinate={Ø}
          title={"title"}
          description={"description"}
        />
        <MapView.Marker
          pinColor={"green"}
          coordinate={midtbyen}
          title={"title"}
          description={"description"}
        />
        <MapView.Marker
          pinColor={color}
          coordinate={havn}
          title={"title"}
          description={"description"}
        />

        <Polyline
          coordinates={coordinates}
          strokeColor="red"
          strokeColors={["#7F0000"]}
          strokeWidth={6}
        />
      </MapView>
      {/*  This one opens the UserLocation.js file */}
      <UserLocation />
    </View>
  );
}
