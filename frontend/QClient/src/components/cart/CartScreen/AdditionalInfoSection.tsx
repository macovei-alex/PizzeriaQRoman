import { CompositeNavigationProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { forwardRef, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { Address } from "src/api/types/Address";
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

  const { theme } = useUnistyles();
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
            <Dropdown
              dropdownStyle={styles.addressPickerContainer}
              dropdownIcon={<></>}
              selectedValue={address.id}
              options={addressDropdownOptions}
              onValueChange={(id) => setAddress(addresses.find((addr) => addr.id === id) || null)}
              primaryColor={theme.background.success}
              modalControls={{ modalProps: { animationType: "fade" } }}
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
        <TextInput
          style={styles.additionalNotesInput}
          placeholder="Mențiuni speciale..."
          placeholderTextColor={theme.text.secondary}
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
