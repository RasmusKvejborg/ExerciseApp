import React, { useState, useEffect } from "react";
import MapView, { Marker, Polyline } from "react-native-maps";
import { StyleSheet, Text, View, Dimensions, Platform } from "react-native";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import UserLocation from "./UserLocation";
import { Component } from "react/cjs/react.development";
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

const SanFrancisco = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.015,
  longitudeDelta: 0.0121,
};

// -----------------------------------------------------------------------------------------
// const [coordinates] = useState([
//   {
//     latitude: 48.8587741,
//     longitude: 2.2069771,
//   },
//   {
//     latitude: 48.8323785,
//     longitude: 2.3361663,
//   },
// ]);

// const TASK_FETCH_LOCATION = "TASK_FETCH_LOCATION";

// // 1 define the task passing its name and a callback that will be called whenever the location changes
// TaskManager.defineTask(
//   TASK_FETCH_LOCATION,
//   async ({ data: { locations }, error }) => {
//     if (error) {
//       console.error("så er der en fejl:");
//       return;
//     }
//     const [location] = locations;
//     console.error("det lykkedes egentlig fint. locations: " + locations);
//   }
// );

// // 2 start the task
// Location.startLocationUpdatesAsync(TASK_FETCH_LOCATION, {
//   accuracy: Location.Accuracy.Highest,
//   distanceInterval: 1, // minimum change (in meters) betweens updates
//   deferredUpdatesInterval: 1000, // minimum interval (in milliseconds) between updates
//   // foregroundService is how you get the task to be updated as often as would be if the app was open
//   foregroundService: {
//     notificationTitle: "Using your location",
//     notificationBody:
//       "To turn off, go back to the app and switch something off.",
//   },
// });

// -----------------------------------------------------------------------------------------

export default function App() {
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
    })();
  }, []);

  //-------------------------------------
  const [coordinates] = useState([
    {
      latitude: silkeborg.latitude,
      longitude: 9.5018,
    },
    {
      latitude: silkeborg.latitude,
      longitude: 2.3361663,
    },
  ]);
  // -----------------------------------------------------------------

  //userLocation nedenfor er den, der henter den anden fil. Det er awesome
  return (
    <View style={globalStyles.container}>
      <MapView // prøver sgu lige i *OVENSTÅENDE VIEW* at fjerne styling til container.
        style={globalStyles.map}
        initialRegion={silkeborg}
        showsUserLocation={true} // DET VAR DENNE HER DER FUCKEDE MIG UP
      >
        {/* <MapView.Marker
          coordinate={{ latitude: 37.78825, longitude: -122.4324 }}
          title={"title"}
          description={"description"}
        /> */}
        <Polyline
          coordinates={coordinates}
          strokeColor="red" // fallback for when `strokeColors` is not supported by the map-provider
          strokeColors={["#7F0000"]}
          strokeWidth={6}
        />
      </MapView>
      <UserLocation />
    </View>
  );
}
