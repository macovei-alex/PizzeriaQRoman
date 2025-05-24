import { CompositeNavigationProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { forwardRef, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Address } from "src/api/types/Address";
import useColorTheme from "src/hooks/useColorTheme";
import { CartStackParamList } from "src/navigation/CartStackNavigator";
import { RootStackParamList } from "src/navigation/RootStackNavigator";
import Dropdown from "react-native-input-select";
import logger from "src/utils/logger";

type NavigationProps = CompositeNavigationProp<
  NativeStackNavigationProp<CartStackParamList, "CartScreen">,
  NativeStackNavigationProp<RootStackParamList>
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

  const selectedAddressRef = useRef<Address | null>(null);
  selectedAddressRef.current = address;

  const addressDropdownOptions = useMemo<{ value: number; label: React.JSX.Element }[]>(() => {
    const width = Dimensions.get("window").width - 84;
    return addresses.map((addressOption) => ({
      label: (
        <View>
          <Text style={[styles.addressPickerLabel, { width }]}>{addressOption.addressString}</Text>
        </View>
      ),
      value: addressOption.id,
    }));
  }, [addresses]);

  return (
    <View style={styles.container}>
      <View style={styles.addressSection}>
        <Text style={styles.subsectionTitle}>Adresă de livrare</Text>
        {addresses &&
          (address ? (
            <Dropdown
              dropdownStyle={StyleSheet.flatten([
                styles.addressPickerContainer,
                { backgroundColor: colorTheme.background.elevated },
              ])}
              dropdownIcon={<></>}
              selectedValue={address.id}
              options={addressDropdownOptions}
              onValueChange={(id) => setAddress(addresses.find((addr) => addr.id === id) || null)}
              primaryColor={colorTheme.background.success}
              modalControls={{ modalProps: { animationType: "fade" } }}
            />
          ) : (
            <>
              <Text style={[styles.noAddressText, { color: colorTheme.text.primary }]}>
                Nu aveți adrese asociate contului curent
              </Text>
              <TouchableOpacity
                style={[styles.addAddressButton, { backgroundColor: colorTheme.background.accent }]}
                onPress={() => navigation.navigate("AddressesScreen")}
              >
                <Text style={{ color: colorTheme.text.onAccent }}>Adăugați o adresă</Text>
              </TouchableOpacity>
            </>
          ))}
      </View>
      <View>
        <Text style={[styles.subsectionTitle, { color: colorTheme.text.primary }]}>Mențiuni speciale</Text>
        <TextInput
          style={[styles.additionalNotesInput, { backgroundColor: colorTheme.background.elevated }]}
          placeholder="Mențiuni speciale..."
          placeholderTextColor={colorTheme.text.secondary}
          multiline
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
    borderWidth: 0,
  },
  addressPickerLabel: {
    fontSize: 16,
    paddingLeft: 4,
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
