import React, { useState } from "react";
import { TextInput, View } from "react-native";
import { StyleSheet, withUnistyles } from "react-native-unistyles";
import SearchIconSvg from "src/components/svg/SearchIconSvg";
import logger from "src/utils/logger";

type SearchBarProps = {
  placeholder: string;
  onSearch: (text: string) => void;
};

export default function SearchBar({ placeholder, onSearch }: SearchBarProps) {
  logger.render("SearchBar");

  const [text, setText] = useState("");

  return (
    <View style={styles.container}>
      <SearchIconSvg style={styles.searchIcon} />
      <StyledTextInput
        placeholder={placeholder}
        value={text}
        onChangeText={(newText) => setText(newText)}
        onSubmitEditing={() => onSearch(text)}
      />
    </View>
  );
}

const StyledTextInput = withUnistyles(TextInput, (theme) => ({
  style: {
    textAlign: "center",
    flexGrow: 1,
    left: -20,
    color: theme.text.primary,
  },
  placeholderTextColor: theme.text.secondary,
}));

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
}));
