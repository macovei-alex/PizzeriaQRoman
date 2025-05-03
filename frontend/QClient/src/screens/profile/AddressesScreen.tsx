import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useAddressesQuery from "src/api/hooks/useAddressesQuery";
import ErrorComponent from "src/components/shared/generic/ErrorComponent";
import ScreenActivityIndicator from "src/components/shared/generic/ScreenActivityIndicator";
import ScreenTitle from "src/components/shared/generic/ScreenTitle";
import useColorTheme from "src/hooks/useColorTheme";

export default function AddressesScreen() {
  const colorTheme = useColorTheme();
  const addressesQuery = useAddressesQuery();

  const addressesStrings = useMemo(() => {
    if (!addressesQuery.data) return [];
    return addressesQuery.data.map((address) => {
      return {
        id: address.id,
        city: address.city,
        street: `${address.street} nr. ${address.streetNumber}`,
        block: `Bloc ${address.block}, et. ${address.floor}, ap. ${address.apartment}`,
      };
    });
  }, [addressesQuery.data]);

  if (addressesQuery.isLoading) return <ScreenActivityIndicator text="Se încarcă adresele" />;
  if (addressesQuery.isError) return <ErrorComponent onRetry={() => addressesQuery.refetch()} />;

  return (
    <SafeAreaView style={[styles.contaier, { backgroundColor: colorTheme.background.primary }]}>
      <ScreenTitle title="Adresele mele" containerStyle={styles.screenTitle} />
      <ScrollView style={styles.addressesContainer}>
        {addressesStrings.map((address) => (
          <View
            key={address.id}
            style={[styles.addressCard, { backgroundColor: colorTheme.background.card }]}
          >
            <Text style={styles.addressText}>Localitatea: {address.city}</Text>
            <Text style={styles.addressText}>Strada: {address.street}</Text>
            <Text style={styles.addressText}>Blocul: {address.block}</Text>
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity style={[styles.newAddressButton, { backgroundColor: colorTheme.background.accent }]}>
        <Text style={[styles.newAddressText, { color: colorTheme.text.onAccent }]}>Adaugă o adresă nouă</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contaier: {
    flex: 1,
    paddingBottom: 12,
  },
  screenTitle: {
    marginBottom: 16,
  },
  addressesContainer: {
    flex: 1,
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  addressCard: {
    padding: 16,
    marginVertical: 8,
    borderRadius: 10,
  },
  addressText: {
    fontSize: 16,
    marginBottom: 5,
  },
  newAddressButton: {
    padding: 16,
    marginHorizontal: 12,
    borderRadius: 24,
    alignItems: "center",
  },
  newAddressText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
