import React, { useState } from "react";
import { TextInput, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import SearchIconSvg from "src/components/svg/SearchIconSvg";
import logger from "src/utils/logger";

type SearchBarProps = {
  placeholder: string;
  onSearch: (text: string) => void;
};

export default function SearchBar({ placeholder, onSearch }: SearchBarProps) {
  logger.render("SearchBar");

  const { theme } = useUnistyles();
  const [text, setText] = useState("");

  return (
    <View style={styles.container}>
      <SearchIconSvg style={styles.searchIcon} />
      <TextInput
        style={styles.textInput}
        placeholderTextColor={theme.text.secondary}
        placeholder={placeholder}
        value={text}
        onChangeText={(newText) => setText(newText)}
        onSubmitEditing={() => onSearch(text)}
      />
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: "row",
    alignSelf: "center",
    width: "90%",
    borderRadius: 9999,
    backgroundColor: theme.background.elevated,
  },
  searchIcon: {
    width: 40,
    height: 40,
  },
  textInput: {
    textAlign: "center",
    flexGrow: 1,
    left: -20,
    color: theme.text.primary,
  },
}));
