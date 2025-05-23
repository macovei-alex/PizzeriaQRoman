import { CompositeNavigationProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AccountForm from "src/components/profile/ProfileScreen/AccountForm";
import TitleSection from "src/components/profile/ProfileScreen/TitleSection";
import ArrowSvg from "src/components/svg/ArrowSvg";
import { useAuthContext } from "src/context/AuthContext";
import { useCartContext } from "src/context/CartContext/CartContext";
import useColorTheme from "src/hooks/useColorTheme";
import { ProfileStackParamList } from "src/navigation/ProfileStackNavigator";
import { RootStackParamList } from "src/navigation/RootStackNavigator";
import logger from "src/utils/logger";

type NavigationProps = CompositeNavigationProp<
  NativeStackNavigationProp<ProfileStackParamList, "ProfileScreen">,
  NativeStackNavigationProp<RootStackParamList>
>;

export default function ProfileScreen() {
  logger.render("ProfileScreen");

  const authContext = useAuthContext();
  const cartContext = useCartContext();
  const colorTheme = useColorTheme();
  const navigation = useNavigation<NavigationProps>();

  return (
    <View style={[styles.container, { backgroundColor: colorTheme.background.primary }]}>
      <ScrollView>
        <TitleSection />

        {/* text section */}
        <View style={[styles.textAreaContainer, { backgroundColor: colorTheme.background.primary }]}>
          {/* account data section */}
          <AccountForm />

          {/* addresses button */}
          <TouchableOpacity
            style={[styles.buttonContainer, { borderBottomColor: colorTheme.background.elevated }]}
            onPress={() => navigation.navigate("AddressesScreen")}
          >
            <Text style={[styles.buttonText, { color: colorTheme.text.primary }]}>Adresele mele</Text>
            <ArrowSvg style={styles.arrowSvg} />
          </TouchableOpacity>

          {/* order history button */}
          <TouchableOpacity
            style={[styles.buttonContainer, { borderBottomColor: colorTheme.background.elevated }]}
            onPress={() => navigation.push("OrderHistoryScreen")}
          >
            <Text style={[styles.buttonText, { color: colorTheme.text.primary }]}>Istoricul comenzilor</Text>
            <ArrowSvg style={styles.arrowSvg} />
          </TouchableOpacity>

          {/* disconnect button */}
          <TouchableOpacity
            style={[styles.buttonContainer, { borderBottomColor: colorTheme.background.elevated }]}
            onPress={() => {
              cartContext.emptyCart();
              authContext.logout();
            }}
          >
            <Text style={[styles.buttonText, { color: colorTheme.text.primary }]}>Deconectare</Text>
            <ArrowSvg style={styles.arrowSvg} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  textAreaContainer: {
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    paddingHorizontal: 12,
    paddingTop: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 2,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
  },
  arrowSvg: {
    width: 26,
    height: 26,
  },
});
