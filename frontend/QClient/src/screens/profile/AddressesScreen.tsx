import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { CompositeNavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useCallback, useLayoutEffect, useState } from "react";
import { Alert, BackHandler, ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "src/api";
import useAddressesQuery from "src/api/hooks/useAddressesQuery";
import { Address } from "src/api/types/Address";
import ModalForm from "src/components/profile/AddressesScreen/ModalForm";
import { NewAddress } from "src/components/profile/AddressesScreen/types/NewAddress";
import ErrorComponent from "src/components/shared/generic/ErrorComponent";
import ScreenActivityIndicator from "src/components/shared/generic/ScreenActivityIndicator";
import ScreenTitle from "src/components/shared/generic/ScreenTitle";
import { useAuthContext } from "src/context/AuthContext";
import useColorTheme from "src/hooks/useColorTheme";
import { ProfileStackParamList } from "src/navigation/ProfileStackNavigator";
import { RootTabParamList } from "src/navigation/TabNavigator";
import logger from "src/utils/logger";

export const emptyModalState: NewAddress = {
  id: 0,
  city: "",
  street: "",
  streetNumber: "",
  block: "",
  floor: "",
  apartment: "",
} as const;

type NavigationProps = CompositeNavigationProp<
  NativeStackNavigationProp<ProfileStackParamList, "AddressesScreen">,
  BottomTabNavigationProp<RootTabParamList>
>;

type RouteProps = RouteProp<ProfileStackParamList, "AddressesScreen">;

export default function AddressesScreen() {
  const colorTheme = useColorTheme();
  const authContext = useAuthContext();
  if (!authContext.account) throw new Error("Account is not defined in AddressesScreen");
  const accountId = authContext.account.id;
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<RouteProps>();
  const addressesQuery = useAddressesQuery();
  const [modalEditState, setModalEditState] = useState<"closed" | "add" | "edit">("closed");
  const [initialModalState, setInitialModalState] = useState(emptyModalState);
  const onModalSubmit = useCallback(
    async (address: NewAddress | null) => {
      setModalEditState("closed");
      if (!address) return;
      try {
        const httpMethod = address.id === 0 ? "POST" : "PUT";
        await api.axios.request<Address>({
          method: httpMethod,
          url:
            httpMethod === "POST"
              ? api.routes.account(accountId).addresses
              : api.routes.account(accountId).address(address.id),
          data: address,
        });
        await addressesQuery.refetch();
      } catch (error) {
        logger.error(error);
      }
    },
    [accountId, addressesQuery]
  );

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
        { cancelable: false }
      );
    },
    [accountId, addressesQuery]
  );

  useLayoutEffect(() => {
    const listener = BackHandler.addEventListener("hardwareBackPress", () => {
      if (route.params) {
        if (route.params.backToScreen === "CartScreen") {
          navigation.popToTop();
          navigation.navigate("CartStackNavigator", { screen: "CartScreen" });
        } else {
          throw new Error("Invalid backToScreen parameter");
        }
        return true;
      }
      return false;
    });
    return () => listener.remove();
  }, [navigation, route.params]);

  if (addressesQuery.isFetching) return <ScreenActivityIndicator text="Se încarcă adresele" />;
  if (addressesQuery.isError) return <ErrorComponent onRetry={() => addressesQuery.refetch()} />;

  return (
    <SafeAreaView style={[styles.contaier, { backgroundColor: colorTheme.background.primary }]}>
      <ScreenTitle title="Adresele mele" containerStyle={styles.screenTitle} />

      {/* Addresses */}
      <ScrollView style={styles.addressesContainer}>
        {addressesQuery.data!.map((address) => (
          <TouchableOpacity
            key={address.id}
            onPress={() => {
              setModalEditState("edit");
              setInitialModalState({ ...address, floor: address.floor.toString() });
            }}
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
        onPress={() => {
          setModalEditState("add");
          setInitialModalState(emptyModalState);
        }}
      >
        <Text style={[styles.newAddressText, { color: colorTheme.text.onAccent }]}>Adaugă o adresă nouă</Text>
      </TouchableOpacity>

      {modalEditState !== "closed" && (
        <ModalForm
          modalEditState={modalEditState}
          initialState={initialModalState}
          onSubmit={onModalSubmit}
        />
      )}
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
