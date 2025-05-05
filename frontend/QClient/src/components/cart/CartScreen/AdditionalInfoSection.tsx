import { Picker } from "@react-native-picker/picker";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { CompositeNavigationProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { forwardRef, useImperativeHandle, useLayoutEffect, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Address } from "src/api/types/Address";
import useColorTheme from "src/hooks/useColorTheme";
import { CartStackParamList } from "src/navigation/CartStackNavigator";
import { RootTabParamList } from "src/navigation/TabNavigator";
import logger from "src/utils/logger";

type NavigationProps = CompositeNavigationProp<
  NativeStackNavigationProp<CartStackParamList, "CartScreen">,
  BottomTabNavigationProp<RootTabParamList>
>;

type AdditionalInfoSectionProps = {
  addresses: Address[];
};

export type AdditionalInfoSectionHandle = {
  getAddress: () => Address | null;
  getAdditionalNotes: () => string | null;
};

function AdditionalInfoSection(
  { addresses }: AdditionalInfoSectionProps,
  ref: React.Ref<AdditionalInfoSectionHandle>
) {
  logger.render("AdditionalInfoSection");

  const colorTheme = useColorTheme();
  const navigation = useNavigation<NavigationProps>();
  const [address, setAddress] = useState<Address | null>(null);
  const [additionalNotes, setAdditionalNotes] = useState<string | null>(null);

  useImperativeHandle(
    ref,
    () => ({
      getAddress: () => address,
      getAdditionalNotes: () => additionalNotes,
    }),
    [address, additionalNotes]
  );

  useLayoutEffect(() => {
    if (!addresses) return;
    setAddress(addresses.find((address) => address.primary) || addresses[0]);
  }, [addresses]);

  return (
    <View style={styles.container}>
      <View style={styles.addressSection}>
        <Text style={styles.subsectionTitle}>Adresă de livrare</Text>
        {addresses &&
          (address ? (
            <View
              style={[styles.addressPickerContainer, { backgroundColor: colorTheme.background.elevated }]}
            >
              <Picker
                numberOfLines={3}
                selectedValue={address}
                onValueChange={(value: Address) => {
                  setAddress(value);
                }}
              >
                {addresses.map((address) => (
                  <Picker.Item
                    key={address.id}
                    style={{ color: colorTheme.text.primary }}
                    label={`${address.street}, No. ` + address.streetNumber}
                    value={address}
                  />
                ))}
              </Picker>
            </View>
          ) : (
            <>
              <Text style={[styles.noAddressText, { color: colorTheme.text.primary }]}>
                Nu aveți adrese asociate contului curent
              </Text>
              <TouchableOpacity
                style={[styles.addAddressButton, { backgroundColor: colorTheme.background.accent }]}
                onPress={() =>
                  navigation.navigate("ProfileStackNavigator", {
                    screen: "AddressesScreen",
                    params: { backToScreen: "CartScreen" },
                  })
                }
              >
                <Text style={{ color: colorTheme.text.onAccent }}>Adăugați o adresă</Text>
              </TouchableOpacity>
            </>
          ))}
      </View>
      <View>
        <Text style={styles.subsectionTitle}>Mențiuni speciale</Text>
        <TextInput
          style={[styles.additionalNotesInput, { backgroundColor: colorTheme.background.elevated }]}
          placeholder="Mențiuni speciale..."
          multiline={true}
          onChangeText={setAdditionalNotes}
        >
          {additionalNotes}
        </TextInput>
      </View>
    </View>
  );
}

export default forwardRef<AdditionalInfoSectionHandle, AdditionalInfoSectionProps>(AdditionalInfoSection);

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 24,
  },
  addressSection: {
    marginBottom: 40,
  },
  addressPickerContainer: {
    paddingHorizontal: 16,
    borderRadius: 24,
  },
  subsectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  noAddressText: {
    fontSize: 16,
    marginBottom: 8,
  },
  addAddressButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 24,
    alignItems: "center",
  },
  additionalNotesInput: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 120,
    textAlignVertical: "top",
    borderRadius: 24,
    fontSize: 16,
  },
});
