import React from "react";
import { StyleSheet, Text, View } from "react-native";
import useColorTheme from "src/hooks/useColorTheme";
import { OptionId, OptionList } from "src/api/types/Product";
import logger from "src/utils/logger";
import TickCheckboxSvg from "src/components/svg/TickCheckboxSvg";
import { formatPrice } from "src/utils/utils";

type OptionListProps = {
  optionList: OptionList;
  selectedOptions: Record<OptionId, number | undefined>;
};

export default function OptionListCard({ optionList, selectedOptions }: OptionListProps) {
  logger.render(`OptionListCard-${optionList.id}`);

  const colorTheme = useColorTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.titleText, { color: colorTheme.text.primary }]}>{optionList.text}</Text>
      {/* options */}
      {optionList.options.map((option) => {
        const currentCount = selectedOptions[option.id] ?? 0;
        const displayCount = +(currentCount === 0 ? 1 : 0);
        const shouldDisplayPrice = option.price > 0;
        const priceToDisplay = displayCount * option.price;

        return (
          <View key={option.id} style={styles.optionContainer}>
            {option.maxCount === 1 ? (
              <View style={[styles.svgContainer, { borderColor: colorTheme.text.primary }]}>
                <TickCheckboxSvg checked={currentCount === 1} style={styles.svg} />
              </View>
            ) : (
              <>
                <Text
                  style={[
                    styles.optionCountText,
                    currentCount > 0 && { color: colorTheme.text.accent, fontWeight: "bold" },
                  ]}
                >
                  {currentCount}
                </Text>
                <Text style={styles.optionCountText}>x</Text>
              </>
            )}
            <Text style={[styles.optionNameText, { color: colorTheme.text.primary }]} numberOfLines={2}>
              {option.name}
            </Text>
            {shouldDisplayPrice && (
              <Text style={[styles.priceText, { color: colorTheme.text.accent }]}>
                +{formatPrice(priceToDisplay)}
              </Text>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
  },
  titleText: {
    fontStyle: "italic",
    fontSize: 22,
    marginBottom: 12,
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },
  svgContainer: {
    marginRight: 6,
  },
  svg: {
    width: 30,
    height: 30,
  },
  optionNameText: {
    fontSize: 16,
    flexGrow: 1,
    flexShrink: 1,
  },
  optionCountText: {
    fontSize: 16,
    marginRight: 6,
  },
  priceText: {
    fontSize: 14,
    fontWeight: "bold",
    flexShrink: 0,
  },
});
