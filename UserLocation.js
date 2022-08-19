import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import MapView, { Marker, Polyline } from "react-native-maps";
import { globalStyles } from "./GlobalStyles.js";
import { test, changeColor } from "./App.js";

const LOCATION_TRACKING = "location-tracking";
function UserLocation() {
  const [locationStarted, setLocationStarted] = React.useState(false);
  const startLocationTracking = async () => {
    await Location.startLocationUpdatesAsync(LOCATION_TRACKING, {
      accuracy: Location.Accuracy.Highest,
      timeInterval: 10000,
      distanceInterval: 0,
    });
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(
      LOCATION_TRACKING
    );
    setLocationStarted(hasStarted);
    console.log("tracking started?", hasStarted);
  };
  React.useEffect(() => {
    const config = async () => {
      let resf = await Location.requestForegroundPermissionsAsync();
      let resb = await Location.requestBackgroundPermissionsAsync();
      if (resf.status != "granted" && resb.status !== "granted") {
        console.log("Permission to access location was denied");
      } else {
        console.log("Permission to access location granted");
      }
    };
    config();
  }, []);

  const startLocation = () => {
    startLocationTracking();
  };
  const stopLocation = () => {
    setLocationStarted(false);
    TaskManager.isTaskRegisteredAsync(LOCATION_TRACKING).then((tracking) => {
      if (tracking) {
        Location.stopLocationUpdatesAsync(LOCATION_TRACKING);
      }
    });
  };

  // --------------test coordinates to be used later---------------------------

  const [cdnates, setCdnates] = useState([
    {
      latitude: 45.78825, // Random latitude. Should be initial location instead
      longitude: 9.4324, // Random longitude. Should be initial location instead
    },
  ]);

  const newCdnates = () => {
    // appends the new locations coordinates to the array.
    setCdnates((prevCdnates) => [
      ...prevCdnates,
      {
        latitude: 0.5, // Random latitude. Should be new location instead
        longitude: 0.8, // Random longitude. Should be new location instead
      },
    ]);
  };
  // ----------------------------

  TaskManager.defineTask(LOCATION_TRACKING, async ({ data, error }) => {
    if (error) {
      console.log("LOCATION_TRACKING task ERROR:", error);
      return;
    }
    if (data) {
      const { locations } = data;
      let lat = locations[0].coords.latitude;
      let long = locations[0].coords.longitude;
      console.log(`${new Date(Date.now()).toLocaleString()}: ${lat},${long}`);

      console.log("Coordinates are: ", cdnates); // prints the test coordinates
    }
  });

  // ------------------------------------------------------------

  return (
    <View style={globalStyles.btnParent}>
      {locationStarted ? (
        <TouchableOpacity onPress={stopLocation}>
          <Text style={globalStyles.btnText}>Stop Tracking</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={startLocation}>
          <Text style={globalStyles.btnText}>Start Tracking</Text>
        </TouchableOpacity>
      )}

      {/*test button that calls setCdnates */}
      <TouchableOpacity onPress={newCdnates}>
        <Text style={globalStyles.btnText}>test button</Text>
      </TouchableOpacity>
    </View>
  );
}

export default UserLocation;
