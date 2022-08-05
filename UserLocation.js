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
    console.log("THE BUTTON HAS BEEN PRESSED");
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

  //-------------------------------------------------------------
  const [coordinates] = useState([
    {
      latitude: 45.78825,
      longitude: 9.4324,
    },
    {
      latitude: 30,
      longitude: 2.3361663,
    },
  ]);

  // -----------------------------------------

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

      if (lat > 0) {
        console.log("lat is above equator");
      } else {
        console.log("lat is below equator");
        // a start could be to make a marker a different color when location is below equator, but SetState cant be called from here to the App.js file.
      }
    }
  });

  // ------------------------------------------------------------

  return (
    <View>
      {locationStarted ? (
        <TouchableOpacity onPress={stopLocation}>
          <Text style={globalStyles.btnText}>Stop Tracking</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={startLocation}>
          <Text style={globalStyles.btnText}>Start Tracking</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default UserLocation;
