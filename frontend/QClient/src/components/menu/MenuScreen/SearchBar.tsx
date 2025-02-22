import React, { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import SearchIconSvg from "@/components/svg/SearchIconSvg";
import useColorTheme from "@/hooks/useColorTheme";
import logger from "@/utils/logger";

type SearchBarProps = {
  placeholder: string;
  onSearch: (text: string) => void;
};

export default function SearchBar({ placeholder, onSearch }: SearchBarProps) {
  logger.render("SearchBar");

  const colorTheme = useColorTheme();
  const [text, setText] = useState("");

  return (
    <View style={[styles.container, { backgroundColor: colorTheme.background.elevated }]}>
      <SearchIconSvg style={styles.searchIcon} />
      <TextInput
        style={styles.textInput}
        placeholder={placeholder}
        value={text}
        onChangeText={(newText) => setText(() => newText)}
        onSubmitEditing={() => {
          onSearch(text);
        }}
      ></TextInput>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignSelf: "center",
    width: "90%",
    borderRadius: 9999,
  },
  searchIcon: {
    width: 40,
    height: 40,
  },
  textInput: {
    textAlign: "center",
    flexGrow: 1,
    left: -20,
  },
});
