import { CompositeNavigationProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useRef } from "react";
import React, { RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import AccountForm, { AccountFormHandle } from "src/components/profile/ProfileScreen/AccountForm";
import TitleSection from "src/components/profile/ProfileScreen/TitleSection";
import ArrowSvg from "src/components/svg/ArrowSvg";
import { useAuthContext } from "src/context/AuthContext";
import { useCartContext } from "src/context/CartContext/CartContext";
import { ProfileStackParamList } from "src/navigation/ProfileStackNavigator";
import { RootStackParamList } from "src/navigation/RootStackNavigator";
import logger from "src/constants/logger";

type NavigationProps = CompositeNavigationProp<
  NativeStackNavigationProp<ProfileStackParamList, "ProfileScreen">,
  NativeStackNavigationProp<RootStackParamList>
>;

export default function ProfileScreen() {
  logger.render("ProfileScreen");

  const authContext = useAuthContext();
  const accountId = authContext.account?.id;
  if (!accountId) throw new Error("Account is not defined in ProfileScreen");
  const cartContext = useCartContext();
  const navigation = useNavigation<NavigationProps>();

  const accountFormRef = useRef<AccountFormHandle>(null);

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={() => accountFormRef.current?.handleRefresh()} />
        }
      >
        <TitleSection />

        {/* text section */}
        <View style={styles.textAreaContainer}>
          {/* account data section */}
          <AccountForm ref={accountFormRef} />

          {/* addresses button */}
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => navigation.navigate("AddressesScreen")}
          >
            <Text style={styles.buttonText}>Adresele mele</Text>
            <ArrowSvg style={styles.arrowSvg} />
          </TouchableOpacity>

          {/* order history button */}
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => navigation.push("OrderHistoryScreen")}
          >
            <Text style={styles.buttonText}>Istoricul comenzilor</Text>
            <ArrowSvg style={styles.arrowSvg} />
          </TouchableOpacity>

          {/* disconnect button */}
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => {
              cartContext.emptyCart();
              authContext.logout();
            }}
          >
            <Text style={styles.buttonText}>Deconectare</Text>
            <ArrowSvg style={styles.arrowSvg} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    backgroundColor: theme.background.primary,
  },
  textAreaContainer: {
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    paddingHorizontal: 12,
    paddingTop: 20,
    backgroundColor: theme.background.primary,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: theme.background.elevated,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.text.primary,
  },
  arrowSvg: {
    width: 26,
    height: 26,
  },
}));
