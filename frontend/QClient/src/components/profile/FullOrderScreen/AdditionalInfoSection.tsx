import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Address } from "src/api/types/Address";
import useColorTheme from "src/hooks/useColorTheme";

type AdditionalInfoSectionProps = {
  address: Address;
  additionalNotes: string | null;
};

export default function AdditionalInfoSection({ address, additionalNotes }: AdditionalInfoSectionProps) {
  const colorTheme = useColorTheme();

  return (
    <View style={styles.container}>
      <View style={styles.addressSection}>
        <Text style={styles.subsectionTitle}>Adresă de livrare</Text>
        <View style={[styles.addressContainer, { backgroundColor: colorTheme.background.elevated }]}>
          <Text style={[styles.addressText, { color: colorTheme.text.primary }]}>
            {`${address.street}, No. ` + address.streetNumber}
          </Text>
        </View>
      </View>

      {/* additional notes */}
      {additionalNotes && (
        <>
          <Text style={[styles.subsectionTitle, { color: colorTheme.text.primary }]}>Mențiuni speciale</Text>
          <Text
            style={[styles.additionalNotesText, { backgroundColor: colorTheme.background.elevated }]}
            numberOfLines={10}
          >
            {additionalNotes}
          </Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
  },
  addressContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 24,
  },
  addressText: {
    fontSize: 16,
  },
  additionalNotesText: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 120,
    textAlignVertical: "top",
    borderRadius: 24,
    fontSize: 16,
  },
});
