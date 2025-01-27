import { StyleSheet, TextInput, View } from "react-native";
import React, { useState } from "react";
import SearchIconSVG from "../../svg/SearchIconSVG";
import useColorTheme from "../../../hooks/useColorTheme";

export default function SearchBar({ placeholder, onSearch }) {
  const colorTheme = useColorTheme();
  const [text, setText] = useState("");

  return (
    <View style={styles.container} backgroundColor={colorTheme.background[700]}>
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
    marginVertical: 8,
    flexGrow: 1,
  },
});
