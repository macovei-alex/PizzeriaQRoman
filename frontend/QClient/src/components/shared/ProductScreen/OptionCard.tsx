import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
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

  const displayCount = currentCount + (currentCount === 0 ? 1 : 0);
  const shouldDisplayPrice = option.price > 0;
  const priceToDisplay = displayCount * option.price;

  return (
    <View style={styles.container}>
      {option.maxCount === 1 ? (
        <TouchableOpacity
          style={styles.svgContainer}
          activeOpacity={0.8}
          onPress={() => onOptionChange(option.id, currentCount === 1 ? 0 : 1)}
        >
          <TickCheckboxSvg checked={currentCount === 1} style={styles.svg} />
        </TouchableOpacity>
      ) : (
        <>
          {/* minus */}
          <TouchableOpacity
            style={styles.svgContainer}
            disabled={currentCount === 0}
            activeOpacity={0.8}
            onPress={() => onOptionChange(option.id, currentCount - 1)}
          >
            <MinusCircleSvg style={styles.svg} disabled={currentCount === 0} />
          </TouchableOpacity>

          {/* option count text */}
          <Text style={styles.optionCountText}>{currentCount}</Text>

          {/* plus */}
          <TouchableOpacity
            style={styles.svgContainer}
            disabled={currentCount === option.maxCount}
            activeOpacity={0.8}
            onPress={() => onOptionChange(option.id, currentCount + 1)}
          >
            <PlusCircleSvg style={styles.svg} disabled={currentCount === option.maxCount} />
          </TouchableOpacity>
        </>
      )}
      <Text style={styles.optionNameText} numberOfLines={2}>
        {option.name}
      </Text>
      {shouldDisplayPrice && <Text style={styles.priceText}>+{formatPrice(priceToDisplay)}</Text>}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },
  svgContainer: {
    marginRight: 6,
    borderColor: theme.text.primary,
  },
  svg: {
    width: 30,
    height: 30,
  },
  optionNameText: {
    fontSize: 16,
    flexGrow: 1,
    flexShrink: 1,
    color: theme.text.primary,
  },
  optionCountText: {
    fontSize: 16,
    marginRight: 6,
  },
  priceText: {
    fontSize: 14,
    fontWeight: "bold",
    flexShrink: 0,
    color: theme.text.accent,
  },
}));
