import React from "react";
import { KeyboardAvoidingView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import useColorTheme from "src/hooks/useColorTheme";
import logger from "src/utils/logger";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import ScreenTitle from "src/components/shared/generic/ScreenTitle";
import { CompositeNavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import ScreenActivityIndicator from "src/components/shared/generic/ScreenActivityIndicator";
import useAddressesQuery from "src/api/hooks/useAddressesQuery";
import { RootStackParamList } from "src/navigation/RootStackNavigator";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFullOrderQuery } from "src/api/hooks/useFullOrderQuery";
import { ProfileStackParamList } from "src/navigation/ProfileStackNavigator";
import ErrorComponent from "src/components/shared/generic/ErrorComponent";
import AdditionalInfoSection from "src/components/profile/FullOrderScreen/AdditionalInfoSection";
import ProductSection from "src/components/profile/FullOrderScreen/ProductSection";

type NavigationProps = CompositeNavigationProp<
  NativeStackNavigationProp<ProfileStackParamList, "FullOrderScreen">,
  NativeStackNavigationProp<RootStackParamList>
>;

type RouteProps = RouteProp<ProfileStackParamList, "FullOrderScreen">;

export default function FullOrderScreen() {
  logger.render("CartScreen");

  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<RouteProps>();
  if (!route.params?.orderId) throw new Error("Order ID is not defined in FullOrderScreen");
  const colorTheme = useColorTheme();
  const orderQuery = useFullOrderQuery(route.params.orderId);
  const addressQuery = useAddressesQuery();

  if (orderQuery.isFetching) return <ScreenActivityIndicator text="Se aduce comanda..." />;
  if (addressQuery.isFetching) return <ScreenActivityIndicator text="Se încarcă adresele..." />;

  if (!orderQuery.data) return <ErrorComponent />;

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={[styles.screen, { backgroundColor: colorTheme.background.primary }]}
    >
      <SafeAreaView>
        <ScrollView>
          <ScreenTitle title="Comanda mea" containerStyle={styles.titleScreenContainer} />

          <ProductSection orderId={orderQuery.data.id} orderItems={orderQuery.data.items} />

          <AdditionalInfoSection
            address={orderQuery.data.address}
            additionalNotes={orderQuery.data.additionalNotes}
          />

          <View style={styles.cloneOrderContainer}>
            <TouchableOpacity
              style={[styles.sendOrderButton, { backgroundColor: colorTheme.background.accent }]}
              onPress={() => {
                // TODO: Implement copy order functionality
                navigation.navigate("MainTabNavigator", {
                  screen: "CartStackNavigator",
                  params: { screen: "CartScreen" },
                });
              }}
            >
              <Text style={[styles.sendOrderText, { color: colorTheme.text.onAccent }]}>
                Clonează comanda
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  titleScreenContainer: {
    marginBottom: 20,
  },
  cloneOrderContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  sendOrderButton: {
    paddingHorizontal: 52,
    paddingVertical: 12,
    borderRadius: 18,
  },
  sendOrderText: {
    fontSize: 22,
    fontWeight: "bold",
  },
});
