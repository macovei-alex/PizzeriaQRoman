import React, { useCallback } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "src/api";
import useAddressesQuery from "src/api/hooks/queries/useAddressesQuery";
import ErrorComponent from "src/components/shared/generic/ErrorComponent";
import ScreenActivityIndicator from "src/components/shared/generic/ScreenActivityIndicator";
import ScreenTitle from "src/components/shared/generic/ScreenTitle";
import { useAuthContext } from "src/context/AuthContext";
import useColorTheme from "src/hooks/useColorTheme";
import logger from "src/utils/logger";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "src/navigation/RootStackNavigator";

type NavigationProps = NativeStackNavigationProp<RootStackParamList, "AddressesScreen">;

export default function AddressesScreen() {
  logger.render("AddressesScreen");

  const colorTheme = useColorTheme();
  const navigation = useNavigation<NavigationProps>();
  const accountId = useAuthContext().account?.id;
  if (!accountId) throw new Error("Account is not defined in AddressesScreen");

  const addressesQuery = useAddressesQuery();

  const showDeleteAddressDialog = useCallback(
    async (addressId: number) => {
      const deleteAddress = async () => {
        try {
          await api.axios.delete(api.routes.account(accountId).address(addressId));
          await addressesQuery.refetch();
        } catch (error) {
          console.error(error);
        }
      };
      Alert.alert(
        "Confirmare",
        "Doriți să ștergeți adresa?",
        [
          {
            text: "Anulează",
            style: "cancel",
          },
          {
            text: "Confirmă",
            onPress: deleteAddress,
          },
        ],
        {
          cancelable: false,
          userInterfaceStyle: colorTheme.name,
        }
      );
    },
    [accountId, addressesQuery, colorTheme.name]
  );

  if (addressesQuery.isFetching) return <ScreenActivityIndicator text="Se încarcă adresele" />;
  if (addressesQuery.isError) return <ErrorComponent />;

  return (
    <SafeAreaView style={[styles.contaier, { backgroundColor: colorTheme.background.primary }]}>
      <ScreenTitle title="Adresele mele" containerStyle={styles.screenTitle} />

      {/* Addresses */}
      <ScrollView style={styles.addressesContainer}>
        {addressesQuery.data!.map((address) => (
          <TouchableOpacity
            key={address.id}
            onLongPress={() => showDeleteAddressDialog(address.id)}
            style={[styles.addressCard, { backgroundColor: colorTheme.background.card }]}
          >
            <Text style={styles.addressText}>Localitatea: {address.city}</Text>
            <Text style={styles.addressText}>Strada: {`${address.street} nr. ${address.streetNumber}`}</Text>
            <Text style={styles.addressText}>
              Blocul: {`Bloc ${address.block}, et. ${address.floor}, ap. ${address.apartment}`}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* New address button */}
      <TouchableOpacity
        style={[styles.newAddressButton, { backgroundColor: colorTheme.background.accent }]}
        onPress={() => navigation.navigate("NewAddressScreen")}
      >
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
