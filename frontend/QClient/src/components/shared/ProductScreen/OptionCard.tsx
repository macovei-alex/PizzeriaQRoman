import React, { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import useColorTheme from "src/hooks/useColorTheme";
import TickCheckboxSvg from "src/components/svg/TickCheckboxSvg";
import { Option, OptionId } from "src/api/types/Product";
import logger from "src/utils/logger";
import { formatPrice } from "src/utils/utils";
import PlusCircleSvg from "src/components/svg/PlusCircleSvg";
import MinusCircleSvg from "src/components/svg/MinusCircleSvg";

type OptionCardProps = {
  option: Option;
  currentCount: number;
  onOptionChange: (optionId: OptionId, newCount: number) => void;
};

export default function OptionCard({ option, currentCount, onOptionChange }: OptionCardProps) {
  logger.render("OptionCard");

  const colorTheme = useColorTheme();

  const optionDisplayedPrice = useMemo(() => {
    if (option.price === 0) return 0;
    if (currentCount > 0) return option.price * currentCount;
    return option.price;
  }, [currentCount, option.price]);

  return (
    <View style={styles.container}>
      {option.maxCount === 1 ? (
        <TouchableOpacity
          style={[styles.checkboxContainer, { borderColor: colorTheme.text.primary }]}
          onPress={() => onOptionChange(option.id, currentCount === 1 ? 0 : 1)}
        >
          <TickCheckboxSvg checked={currentCount === 1} style={styles.checkbox} />
        </TouchableOpacity>
      ) : (
        <>
          <TouchableOpacity
            style={[styles.checkboxContainer, { borderColor: colorTheme.text.primary }]}
            onPress={() => onOptionChange(option.id, currentCount + 1)}
          >
            <PlusCircleSvg style={styles.checkbox} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.checkboxContainer, { borderColor: colorTheme.text.primary }]}
            onPress={() => onOptionChange(option.id, currentCount + 1)}
          >
            <MinusCircleSvg style={styles.checkbox} />
          </TouchableOpacity>
        </>
      )}
      <Text style={[styles.optionNameText, { color: colorTheme.text.primary }]}>{option.name}</Text>
      {optionDisplayedPrice > 0 && (
        <Text style={[styles.priceText, { color: colorTheme.text.accent }]}>
          +{formatPrice(optionDisplayedPrice)}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },
  checkboxContainer: {
    marginRight: 12,
  },
  checkbox: {
    width: 30,
    height: 30,
  },
  optionNameText: {
    fontSize: 16,
    flexGrow: 1,
  },
  priceText: {
    fontSize: 14,
    fontWeight: "bold",
  },
});
