import React, { useState, useEffect } from "react";
import MapView, { Marker, Polyline, Callout, Circle } from "react-native-maps";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Platform,
  PermissionsAndroid,
  Alert,
} from "react-native";
import * as Location from "expo-location";
import UserLocation from "./UserLocation";
import { globalStyles } from "./GlobalStyles.js";

// -------------------------------------------------

export default function App({ name, onNameChange }) {
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 0,
    longitude: 0,
  });

  const [coordinates, setCoordinates] = useState([]);

  const [oldCoordinates, setOldCoordinates] = useState([]);

  useEffect(() => {
    (async () => {
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );

      if (!granted) {
        Alert.alert(
          "",
          "Run Every Street collects location data to enable drawing of the trail you are running, and could be collected even when the app is closed or not in use. ALLOW ALL THE TIME to make the app run properly.",
          [
            { text: "Cancel", onPress: () => console.log("Cancel Pressed!") },
            {
              text: "OK",
              onPress: async () => {
                let { status } =
                  await Location.requestForegroundPermissionsAsync();

                if (status !== "granted") {
                  console.log("Permission to access location was denied");
                  return;
                }

                let location = await Location.getCurrentPositionAsync({});

                setCurrentLocation({
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                });
                config();
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        // if status has been granted, get current location
        let location = await Location.getCurrentPositionAsync({});

        setCurrentLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        setOldCoordinates([
          { latitude: 41.73767484979501, longitude: 12.703637927770613 },
          { latitude: 35.738562243639635, longitude: -115.701931037008762 },
        ]);
        // console.log("App coordinates: " + coordinates);
      }
    })();
  }, []);

  function callbackFunction(data) {
    setCoordinates((prevCdnates) => [
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
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
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
        <Polyline
          coordinates={oldCoordinates}
          strokeColor="green"
          strokeColors={["#287f00"]}
          strokeWidth={5}
        />
      </MapView>
      <UserLocation callback={callbackFunction} />
    </View>
  );
}
