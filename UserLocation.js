import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  PermissionsAndroid,
  Alert,
} from "react-native";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { globalStyles } from "./GlobalStyles.js";
import CoordinatesManager from "./CoordinatesManager";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "react-native/Libraries/NewAppScreen";
// import App from "./App.js";

const LOCATION_TRACKING = "location-tracking";

export const config = async () => {
  // is being called to keep people in the loop of accepting location
  let resf = await Location.requestForegroundPermissionsAsync();
  let resb = await Location.requestBackgroundPermissionsAsync();
  if (resf.status != "granted" && resb.status !== "granted") {
    console.log("Permission to access location was denied");
  } else {
    console.log("Permission to access location granted");
  }
};

function UserLocation(props) {
  const [locationStarted, setLocationStarted] = useState(false);
  const [coordindates, updateCoordinates] = CoordinatesManager();
  const startLocationTracking = async () => {
    const granted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );
    if (!granted) {
      Alert.alert(
        "",
        "Run Every Street collects location data to enable drawing of the trail you are running, even when the app is closed or not in use. ALLOW ALL THE TIME to make the app run properly",
        [
          { text: "Cancel", onPress: () => console.log("Cancel Pressed") },
          {
            text: "OK",
            onPress: async () => {
              let { status } =
                await Location.requestForegroundPermissionsAsync();
              if (status !== "granted") {
                console.log("Permission to access location was denied");
                return;
              }
            },
          },
        ],
        { cancelable: false }
      );
    } else {
      config().then(async () => {
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
      });

      Location.startLocationUpdatesAsync(LOCATION_TRACKING, {
        accuracy: Location.Accuracy.Highest,
        timeInterval: 0,
        distanceInterval: 8,
      })
        .then(() => {
          Location.hasStartedLocationUpdatesAsync(LOCATION_TRACKING)
            .then((hasStarted) => {
              console.log("tracking started?", hasStarted);
            })
            .catch(config);
        })
        .catch(config);
    }
  }; //---------------------------------- </function UserLocation(props)> end

  // save function to save the red lines (not needed in the version Hussain is building, because you can see in the street-completion where you have been)
  // const saveFunction = async () => {
  //   // console.log("coordiater is: " + App.coordindates);
  //   try {
  //     await AsyncStorage.setItem("@CoordinatesLines", coordindates.toString());
  //     const value = await AsyncStorage.getItem("@CoordinatesLines");
  //     if (value !== null) {
  //       console.log("lines should be saved now " + value);
  //     } else {
  //       console.log("value is nulls " + value);
  //     }
  //   } catch (error) {
  //     console.log("eRrOr MsG: ", error);
  //   }
  // };
  // -------------------------------

  const startLocation = () => {
    startLocationTracking();
  };

  const stopLocation = () => {
    // HERE IT SHOULD SAVE THE COORDINATES FROM const [coordindates, updateCoordinates] = CoordinatesManager();
    // saveFunction();
    setLocationStarted(false);
    TaskManager.isTaskRegisteredAsync(LOCATION_TRACKING).then((tracking) => {
      if (tracking) {
        Location.stopLocationUpdatesAsync(LOCATION_TRACKING);
      }
    });
  };

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
      console.log("new location received");
      props.callback(fullLocation);
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
    </View>
  );
}

export default UserLocation;
