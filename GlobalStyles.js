import { StyleSheet, Text, View, Dimensions, Platform } from "react-native";

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  btnText: {
    // zIndex: 1, // slet igen
    fontSize: 20,
    backgroundColor: "green",
    color: "white",
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 100,
    // bottom: -70,
    // position: "absolute",
    // alignSelf: "center",
  },
  test: {
    flex: 1,
  },
});
