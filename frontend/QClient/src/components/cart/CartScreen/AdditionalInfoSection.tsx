import { CompositeNavigationProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { ForwardedRef, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { StyleSheet, withUnistyles } from "react-native-unistyles";
import { Address } from "src/api/types/Address";
import { CartStackParamList } from "src/navigation/CartStackNavigator";
import { RootStackParamList } from "src/navigation/RootStackNavigator";
import Dropdown from "react-native-input-select";
import logger from "src/constants/logger";

type NavigationProps = CompositeNavigationProp<
  NativeStackNavigationProp<CartStackParamList, "CartScreen">,
  NativeStackNavigationProp<RootStackParamList>
>;

export type AdditionalInfoSectionHandle = {
  getAddress: () => Address | undefined;
  getAdditionalNotes: () => string | undefined;
};

type AdditionalInfoSectionProps = {
  addresses: Address[];
  ref: ForwardedRef<AdditionalInfoSectionHandle>;
};

export default function AdditionalInfoSection({ addresses, ref }: AdditionalInfoSectionProps) {
  logger.render("AdditionalInfoSection");

  const navigation = useNavigation<NavigationProps>();
  const [address, setAddress] = useState<Address | undefined>(undefined);
  const [additionalNotes, setAdditionalNotes] = useState<string | undefined>(undefined);

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

  const selectedAddressRef = useRef<Address | undefined>(undefined);
  selectedAddressRef.current = address;

  const addressDropdownOptions = useMemo<{ value: number; label: React.JSX.Element }[]>(() => {
    return addresses.map((addressOption) => ({
      label: (
        <View>
          <Text style={styles.addressPickerLabel}>{addressOption.addressString}</Text>
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
            <UDropdown
              dropdownIcon={<></>}
              dropdownStyle={styles.addressPickerContainer}
              selectedValue={address.id}
              options={addressDropdownOptions}
              onValueChange={(id) => setAddress(addresses.find((addr) => addr.id === id))}
              modalControls={{ modalProps: { animationType: "slide" } }}
            />
          ) : (
            <>
              <Text style={styles.noAddressText}>Nu aveți adrese asociate contului curent</Text>
              <TouchableOpacity
                style={styles.addAddressButton}
                onPress={() => navigation.navigate("AddressesScreen")}
              >
                <Text style={styles.addAddressText}>Adăugați o adresă</Text>
              </TouchableOpacity>
            </>
          ))}
      </View>
      <View>
        <Text style={styles.subsectionTitle}>Mențiuni speciale</Text>
        <UTextInput
          style={styles.additionalNotesInput}
          placeholder="Mențiuni speciale..."
          multiline
          onChangeText={setAdditionalNotes}
        >
          {additionalNotes}
        </UTextInput>
      </View>
    </View>
  );
}

const UDropdown = withUnistyles(Dropdown, (theme) => ({
  primaryColor: theme.background.success,
}));

const UTextInput = withUnistyles(TextInput, (theme) => ({
  placeholderTextColor: theme.text.secondary,
}));

const styles = StyleSheet.create((theme, runtime) => ({
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
    backgroundColor: theme.background.elevated,
  },
  addressPickerLabel: {
    fontSize: 16,
    paddingLeft: 4,
    width: runtime.screen.width - 84,
  },
  subsectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: theme.text.primary,
  },
  noAddressText: {
    fontSize: 16,
    marginBottom: 8,
    color: theme.text.primary,
  },
  addAddressButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 24,
    alignItems: "center",
    backgroundColor: theme.background.accent,
  },
  addAddressText: {
    color: theme.text.onAccent,
  },
  additionalNotesInput: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 120,
    textAlignVertical: "top",
    borderRadius: 24,
    fontSize: 16,
    backgroundColor: theme.background.elevated,
  },
}));
