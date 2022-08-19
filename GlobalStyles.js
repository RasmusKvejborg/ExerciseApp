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
    fontSize: 20,
    backgroundColor: "green",
    color: "white",
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 100,
  },
  btnParent: {
    position: "absolute",
    bottom: -20,
    alignSelf: "center",
  },
  test: {
    flex: 1,
  },
});
