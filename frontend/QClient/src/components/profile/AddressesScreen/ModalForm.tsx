import React, { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import useColorTheme from "src/hooks/useColorTheme";
import { NewAddress } from "./types/NewAddress";
import { showToast } from "src/utils/toast";
import TextInputComponent from "src/components/shared/generic/TextInput";

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

export default function ModalForm({ modalEditState, initialState, onSubmit }: ModalFormProps) {
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
        <TextInputComponent
          label="Localitatea"
          style={styles.input}
          value={modalState.city}
          onChangeText={(text) => setModalState({ ...modalState, city: text })}
        />
        <TextInputComponent
          label="Numele Străzii"
          scrollEnabled
          style={styles.input}
          value={modalState.street}
          onChangeText={(text) => setModalState({ ...modalState, street: text })}
        />
        <TextInputComponent
          label="Numărul Străzii"
          style={styles.input}
          value={modalState.streetNumber}
          onChangeText={(text) => setModalState({ ...modalState, streetNumber: text })}
        />
        <TextInputComponent
          label="Blocul"
          style={styles.input}
          value={modalState.block}
          onChangeText={(text) => setModalState({ ...modalState, block: text })}
        />
        <View style={styles.floorAndApartmentContainer}>
          <TextInputComponent
            label="Etajul"
            keyboardType="numeric"
            style={styles.input}
            value={modalState.floor}
            onChangeText={(text) => setModalState({ ...modalState, floor: text })}
          />
          <TextInputComponent
            label="Apartamentul"
            style={styles.input}
            value={modalState.apartment}
            onChangeText={(text) => setModalState({ ...modalState, apartment: text })}
          />
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
    backgroundColor: "rgba(0,0,0,0.3)",
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
    marginBottom: 8,
  },
  input: {
    marginVertical: -2,
    flexGrow: 1,
    flexShrink: 1,
  },
  floorAndApartmentContainer: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "space-around",
    alignItems: "center",
  },
  confirmAddressButton: {
    padding: 16,
    marginTop: 0,
    borderRadius: 24,
    alignItems: "center",
  },
  confirmAddressText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
