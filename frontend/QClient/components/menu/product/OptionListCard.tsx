import React from "react";
import { StyleSheet, Text, View } from "react-native";
import useColorTheme from "@/hooks/useColorTheme";
import { OptionId, OptionList, OptionListId } from "@/api/types/Product";
import OptionCard from "./OptionCard";
import logger from "@/utils/logger";

type OptionListProps = {
  optionList: OptionList;
  currentOptionCounts: Record<OptionId, number>;
  onOptionChange: (optionListId: OptionListId, optionId: OptionId, newCount: number) => void;
};

export default function OptionListCard({ optionList, currentOptionCounts, onOptionChange }: OptionListProps) {
  logger.render("OptionListCard");

  const colorTheme = useColorTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.titleText, { color: colorTheme.text.primary }]}>{optionList.text}</Text>
      {optionList.options.map((option) => (
        <OptionCard
          key={option.id}
          option={option}
          currentCount={currentOptionCounts[option.id] || 0}
          onOptionChange={(optionId, newCount) => onOptionChange(optionList.id, optionId, newCount)}
        />
      ))}
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
});
