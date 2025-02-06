import React, { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import SearchIconSVG from "@/components/svg/SearchIconSVG";
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
    <View style={[styles.container, { backgroundColor: colorTheme.background[700] }]}>
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
    alignSelf: "center",
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
