import { Text, TextInput, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import SearchIconSVG from "../svg/SearchIconSVG";

export default function SearchBar({ placeholder, onSearch }) {
  const [text, setText] = useState("");

  return (
    <View className="items-center">
      <View className="flex-row bg-bg-700 rounded-full w-[90%]">
        <SearchIconSVG width={40} height={40} />
        <TextInput
          placeholder={placeholder}
          value={text}
          onChangeText={(newText) => setText((_) => newText)}
          textAlign="center"
          className="flex-1"
        />
      </View>
    </View>
  );
}
