import { StyleSheet, TextInput, View } from "react-native";
import React, { useState } from "react";
import SearchIconSVG from "../svg/SearchIconSVG";

export default function SearchBar({ placeholder, onSearch }) {
  const [text, setText] = useState("");

  return (
    <View style={styles.container}>
      <SearchIconSVG style={styles.searchIcon} />
      <TextInput
        style={styles.textInput}
        placeholder={placeholder}
        value={text}
        onChangeText={(newText) => setText(() => newText)}
        onEndEditing={() => {
          onSearch(text);
        }}
      ></TextInput>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#f6f6f6",
    left: "5%",
    width: "90%",
    borderRadius: 9999,
  },
  searchIcon: {
    position: "absolute",
    width: 40,
    height: 40,
  },
  textInput: {
    textAlign: "center",
    flexGrow: 1,
  },
});
