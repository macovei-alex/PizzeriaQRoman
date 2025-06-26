import React from "react";
import { View, Text } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { Address } from "src/api/types/Address";
import logger from "src/utils/logger";

type AdditionalInfoSectionProps = {
  address: Address;
  additionalNotes: string | null;
};

export default function AdditionalInfoSection({ address, additionalNotes }: AdditionalInfoSectionProps) {
  logger.render("AdditionalInfoSection");

  return (
    <View style={styles.container}>
      <View style={styles.addressSection}>
        <Text style={styles.subsectionTitle}>Adresă de livrare</Text>
        <View style={styles.addressContainer}>
          <Text style={styles.addressText}>{address.addressString}</Text>
        </View>
      </View>

      {/* additional notes */}
      {additionalNotes && (
        <>
          <Text style={styles.subsectionTitle}>Mențiuni speciale</Text>
          <Text style={styles.additionalNotesText} numberOfLines={10}>
            {additionalNotes}
          </Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 24,
  },
  addressSection: {
    marginBottom: 20,
  },
  subsectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: theme.text.primary,
  },
  addressContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 24,
    backgroundColor: theme.background.elevated,
  },
  addressText: {
    fontSize: 16,
    color: theme.text.primary,
  },
  additionalNotesText: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 120,
    textAlignVertical: "top",
    borderRadius: 24,
    fontSize: 16,
    backgroundColor: theme.background.elevated,
  },
}));
