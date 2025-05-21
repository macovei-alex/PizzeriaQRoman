import React, { memo, useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import useColorTheme from "src/hooks/useColorTheme";
import { OptionId, OptionList } from "src/api/types/Product";
import OptionCard from "./OptionCard";
import logger from "src/utils/logger";
import equal from "fast-deep-equal";
import { showToast } from "src/utils/toast";
import { CartItemOptions } from "src/context/CartContext/types";

type OptionListProps = {
  optionList: OptionList;
  currentOptions: Record<OptionId, number>;
  setCartItemOptions: React.Dispatch<React.SetStateAction<CartItemOptions>>;
};

function OptionListCard({ optionList, currentOptions, setCartItemOptions }: OptionListProps) {
  logger.render(`OptionListCard-${optionList.id}`);

  const colorTheme = useColorTheme();

  const handleOptionChange = useCallback(
    (optionId: OptionId, newCount: number) => {
      const option = optionList.options.find((option) => option.id === optionId);
      if (!option) throw new Error(`Option not found: ${optionId}`);

      if (newCount < 0 || newCount > option.maxCount) throw new Error(`Invalid option count: ${newCount}`);

      const choiceCount = Object.values(currentOptions || {}).reduce(
        (acc, count) => acc + (count !== 0 ? 1 : 0),
        0
      );
      if (choiceCount === optionList.maxChoices && (currentOptions[optionId] ?? 0) === 0) {
        showToast(`Poți alege maxim ${optionList.maxChoices} opțiuni din această listă`);
        return;
      }

      setCartItemOptions((prev) => {
        if (!!prev[optionList.id] && newCount === prev[optionList.id][optionId]) return prev;

        const newOptionCounts = { ...prev[optionList.id], [optionId]: newCount };
        if (newCount === 0) delete newOptionCounts[optionId];

        const newOptions = { ...prev, [optionList.id]: newOptionCounts };
        if (Object.keys(newOptionCounts).length === 0) delete newOptions[optionList.id];

        return newOptions;
      });
    },
    [currentOptions, setCartItemOptions, optionList.maxChoices, optionList.id, optionList.options]
  );

  return (
    <View style={styles.container}>
      <Text style={[styles.titleText, { color: colorTheme.text.primary }]}>{optionList.text}</Text>
      {optionList.options.map((option) => (
        <OptionCard
          key={option.id}
          option={option}
          currentCount={currentOptions[option.id] || 0}
          onOptionChange={handleOptionChange}
        />
      ))}
    </View>
  );
}

export default memo(OptionListCard, (prevProps, nextProps) => {
  if (prevProps.optionList.id !== nextProps.optionList.id) return false;
  if (!equal(prevProps.currentOptions, nextProps.currentOptions)) return false;
  if (prevProps.setCartItemOptions !== nextProps.setCartItemOptions) return false;
  return true;
});

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
  },
  titleText: {
    fontStyle: "italic",
    fontSize: 22,
    marginBottom: 12,
  },
});
