import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { globalStyles } from "./GlobalStyles.js";
import CoordinatesManager from "./CoordinatesManager";

const LOCATION_TRACKING = "location-tracking";

function UserLocation(props) {
  const [locationStarted, setLocationStarted] = useState(false);
  const [coordindates, updateCoordinates] = CoordinatesManager();

  const startLocationTracking = async () => {
    await Location.startLocationUpdatesAsync(LOCATION_TRACKING, {
      accuracy: Location.Accuracy.Highest,
      timeInterval: 0,
      distanceInterval: 8,
    });

    const hasStarted = await Location.hasStartedLocationUpdatesAsync(
      LOCATION_TRACKING
    );
    setLocationStarted(hasStarted);
    console.log("tracking started?", hasStarted);
  };

  useEffect(() => {
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

  // --------------coordinates to be used for polygon---------------------------
  const newCdnates = (data) => {
    updateCoordinates(data);
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
      let fullLocation = { latitude: lat, longitude: long };
      // let fullCoord = `${new Date(Date.now()).toLocaleString()}: ${lat},${long}`;
      console.log("ny location");
      props.callback(fullLocation);
      // console.log(getAddressFromCoordinates(lat, long));
      {
        // lat > 0
        //   ? long > 0
        //     ? console.log("Heyy")
        //     : console.log("long er under nul")
        //   : console.log("ja"); // få denne her ind i historikken i stedet og tildel den 2 coordinates
      }
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
      {/* <TouchableOpacity onPress={newCdnates}>
        <Text style={globalStyles.btnText}>test button</Text>
      </TouchableOpacity> */}
    </View>
  );
}

export default UserLocation;
