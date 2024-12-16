import { Text, TextInput, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import SearchIconSVG from "../svg/SearchIconSVG";

function SearchBar({ placeholder, onSearch }) {
  const [text, setText] = useState("");

  return (
    <View className="items-center">
      <View className="flex-row bg-bg-700 rounded-full w-[90%]">
        <SearchIconSVG width={40} height={40} classNames="absolute" />
        <TextInput
          placeholder={placeholder}
          value={text}
          textAlign="center"
          onChangeText={(newText) => setText((_) => newText)}
          onEndEditing={() => {
            onSearch(text);
          }}
          className="flex-1"
        ></TextInput>
      </View>
    </View>
  );
}

export default SearchBar;
