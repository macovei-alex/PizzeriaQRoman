import React, { useState } from "react";
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import useColorTheme from "src/hooks/useColorTheme";
import { NewAddress } from "./types/NewAddress";
import { showToast } from "src/utils/toast";
import LabelledBorderComponent from "src/components/shared/generic/LabelledBorderComponent";

function validateAddress(address: NewAddress): string | null {
  if (address.city.length === 0) return "Vă rugăm să introduceți localitatea";
  if (address.street.length === 0) return "Vă rugăm să introduceți numele străzii";
  if (address.streetNumber.length === 0) return "Vă rugăm să introduceți numărul străzii";
  if (address.block.length === 0) return "Vă rugăm să introduceți blocul";
  if (address.floor.length === 0) return "Vă rugăm să introduceți etajul";
  if (!Number.isInteger(Number(address.floor))) return "Etajul trebuie să fie un număr întreg";
  if (address.apartment.length === 0) return "Vă rugăm să introduceți apartamentul";
  return null;
}

type ModalFormProps = {
  modalEditState: "closed" | "add" | "edit";
  initialState: NewAddress;
  onSubmit: (address: NewAddress | null) => void;
};

export default function AddressForm({ modalEditState, initialState, onSubmit }: ModalFormProps) {
  const colorTheme = useColorTheme();
  const [modalState, setModalState] = useState<NewAddress>(initialState);

  return (
    <Modal transparent visible animationType="slide" onRequestClose={() => onSubmit(null)}>
      <TouchableOpacity style={styles.modalBackdrop} onPress={() => onSubmit(null)} />
      <View style={[styles.modalContent, { backgroundColor: colorTheme.background.primary }]}>
        {/* Title */}
        <Text style={styles.modalTitle}>
          {modalEditState === "add" ? "Introduceți o adresă nouă" : "Modificați adresa"}
        </Text>

        {/* Inputs */}
        <LabelledBorderComponent label="Localitatea">
          <TextInput
            value={modalState.city}
            onChangeText={(text) => setModalState({ ...modalState, city: text })}
          />
        </LabelledBorderComponent>
        <LabelledBorderComponent label="Numele Străzii">
          <TextInput
            scrollEnabled
            value={modalState.street}
            onChangeText={(text) => setModalState({ ...modalState, street: text })}
          />
        </LabelledBorderComponent>
        <LabelledBorderComponent label="Numărul Străzii">
          <TextInput
            value={modalState.streetNumber}
            onChangeText={(text) => setModalState({ ...modalState, streetNumber: text })}
          />
        </LabelledBorderComponent>
        <LabelledBorderComponent label="Blocul">
          <TextInput
            value={modalState.block}
            onChangeText={(text) => setModalState({ ...modalState, block: text })}
          />
        </LabelledBorderComponent>

        {/* floor and apartment section */}
        <View style={styles.floorAndApartmentContainer}>
          <LabelledBorderComponent label="Etajul" style={styles.floorAndAptLabelledBorder}>
            <TextInput
              keyboardType="numeric"
              value={modalState.floor}
              onChangeText={(text) => setModalState({ ...modalState, floor: text })}
            />
          </LabelledBorderComponent>

          <LabelledBorderComponent label="Apartamentul" style={styles.floorAndAptLabelledBorder}>
            <TextInput
              value={modalState.apartment}
              onChangeText={(text) => setModalState({ ...modalState, apartment: text })}
            />
          </LabelledBorderComponent>
        </View>

        {/* Confirm button */}
        <TouchableOpacity
          style={[styles.confirmAddressButton, { backgroundColor: colorTheme.background.accent }]}
          onPress={() => {
            const validationMessage = validateAddress(modalState);
            if (validationMessage) {
              showToast(validationMessage);
            } else {
              onSubmit(modalState);
            }
          }}
        >
          <Text style={[styles.confirmAddressText, { color: colorTheme.text.onAccent }]}>Confirmare</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  floorAndApartmentContainer: {
    flexDirection: "row",
    gap: 12,
  },
  floorAndAptLabelledBorder: {
    flex: 1,
  },
  confirmAddressButton: {
    padding: 12,
    marginTop: 20,
    borderRadius: 24,
    alignItems: "center",
  },
  confirmAddressText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
