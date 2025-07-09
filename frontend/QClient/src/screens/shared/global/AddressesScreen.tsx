import React, { useCallback } from "react";
import { Alert, RefreshControl, ScrollView, Text, TouchableOpacity } from "react-native";
import { StyleSheet, UnistylesRuntime } from "react-native-unistyles";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "src/api";
import useAddressesQuery from "src/api/hooks/queries/useAddressesQuery";
import ErrorComponent from "src/components/shared/generic/ErrorComponent";
import ScreenActivityIndicator from "src/components/shared/generic/ScreenActivityIndicator";
import ScreenTitle from "src/components/shared/generic/ScreenTitle";
import { useValidAccountId } from "src/context/AuthContext";
import logger from "src/constants/logger";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "src/navigation/RootStackNavigator";

type NavigationProps = NativeStackNavigationProp<RootStackParamList, "AddressesScreen">;

export default function AddressesScreen() {
  logger.render("AddressesScreen");

  const navigation = useNavigation<NavigationProps>();
  const accountId = useValidAccountId();
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
          userInterfaceStyle: UnistylesRuntime.themeName,
        }
      );
    },
    [accountId, addressesQuery]
  );

  if (addressesQuery.isFetching) return <ScreenActivityIndicator text="Se încarcă adresele" />;
  if (addressesQuery.isError) return <ErrorComponent />;

  return (
    <SafeAreaView style={styles.contaier}>
      <ScreenTitle title="Adresele mele" containerStyle={styles.screenTitle} />

      {/* Addresses */}
      <ScrollView
        style={styles.addressesContainer}
        refreshControl={<RefreshControl refreshing={false} onRefresh={addressesQuery.refetch} />}
      >
        {addressesQuery.data!.map((address) => (
          <TouchableOpacity
            key={address.id}
            onLongPress={() => showDeleteAddressDialog(address.id)}
            style={styles.addressCard}
          >
            <Text style={styles.addressText}>{address.addressString}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* New address button */}
      <TouchableOpacity
        style={styles.newAddressButton}
        onPress={() => navigation.navigate("NewAddressScreen")}
      >
        <Text style={styles.newAddressText}>Adaugă o adresă nouă</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create((theme) => ({
  contaier: {
    flex: 1,
    paddingBottom: 16,
    backgroundColor: theme.background.primary,
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
    backgroundColor: theme.background.card,
  },
  addressText: {
    fontSize: 16,
    marginBottom: 5,
  },
  newAddressButton: {
    paddingVertical: 12,
    marginHorizontal: 12,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: theme.background.accent,
  },
  newAddressText: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.text.onAccent,
  },
}));
