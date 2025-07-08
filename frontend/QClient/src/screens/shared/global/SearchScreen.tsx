import React, { useEffect, useRef, useState } from "react";
import { TextInput, View } from "react-native";
import { StyleSheet, withUnistyles } from "react-native-unistyles";
import { SafeAreaView } from "react-native-safe-area-context";
import logger from "src/constants/logger";
import { useDebounceSearch } from "src/hooks/useDebouncedSearch";
import ProductLink from "src/components/shared/global/SearchScreen/ProductLink";

export default function SearchScreen() {
  logger.render("SearchScreen");

  const [currentMessage, setCurrentMessage] = useState("");
  const productMatches = useDebounceSearch(currentMessage, 500).slice(0, 5);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.inputContainer}>
        <UTextInput
          ref={inputRef}
          placeholder="Introduceți produse sau ingrediente..."
          style={styles.input}
          value={currentMessage}
          onChangeText={setCurrentMessage}
        />
      </View>

      <View style={styles.productLinksContainer}>
        {productMatches.map((product, index) => (
          <ProductLink key={index} product={product} index={index} />
        ))}
      </View>
    </SafeAreaView>
  );
}

const UTextInput = withUnistyles(TextInput, (theme) => ({
  placeholderTextColor: theme.text.secondary,
}));

const styles = StyleSheet.create((theme) => ({
  screen: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 12,
    gap: 18,
    backgroundColor: theme.background.primary,
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: theme.background.elevated,
    borderColor: theme.text.primary,
  },
  productLinksContainer: {
    alignItems: "flex-start",
    gap: 12,
  },
  input: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    color: theme.text.primary,
    fontSize: 16,
  },
}));
