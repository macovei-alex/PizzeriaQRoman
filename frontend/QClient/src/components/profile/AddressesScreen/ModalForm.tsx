import React, { useState } from "react";
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import useColorTheme from "src/hooks/useColorTheme";
import { NewAddress } from "./types/NewAddress";
import { showToast } from "src/utils/toast";

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
  const [modalState, setModalState] = useState(initialState);

  return (
    <Modal transparent visible animationType="slide" onRequestClose={() => onSubmit(null)}>
      <TouchableOpacity style={styles.modalBackdrop} onPress={() => onSubmit(null)} />
      <View style={[styles.modalContent, { backgroundColor: colorTheme.background.primary }]}>
        {/* Title */}
        <Text style={styles.modalTitle}>
          {modalEditState === "add" ? "Introduceți o adresă nouă" : "Modificați adresa"}
        </Text>

        {/* Inputs */}
        <TextInput
          onChangeText={(text) => setModalState({ ...modalState, city: text })}
          value={modalState.city}
          placeholder="Localitatea"
          style={[styles.input, { backgroundColor: colorTheme.background.card }]}
        />
        <TextInput
          onChangeText={(text) => setModalState({ ...modalState, street: text })}
          value={modalState.street}
          numberOfLines={2}
          multiline
          placeholder="Numele Străzii"
          style={[styles.input, { backgroundColor: colorTheme.background.card }]}
        />
        <TextInput
          onChangeText={(text) => setModalState({ ...modalState, streetNumber: text })}
          value={modalState.streetNumber}
          placeholder="Numărul Străzii"
          style={[styles.input, { backgroundColor: colorTheme.background.card }]}
        />
        <TextInput
          onChangeText={(text) => setModalState({ ...modalState, block: text })}
          value={modalState.block}
          placeholder="Blocul"
          style={[styles.input, { backgroundColor: colorTheme.background.card }]}
        />
        <TextInput
          onChangeText={(text) => setModalState({ ...modalState, floor: text })}
          value={modalState.floor}
          keyboardType="numeric"
          placeholder="Etajul"
          style={[styles.input, { backgroundColor: colorTheme.background.card }]}
        />
        <TextInput
          onChangeText={(text) => setModalState({ ...modalState, apartment: text })}
          value={modalState.apartment}
          placeholder="Apartamentul"
          style={[styles.input, { backgroundColor: colorTheme.background.card }]}
        />

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
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  confirmAddressButton: {
    padding: 16,
    marginTop: 24,
    borderRadius: 24,
    alignItems: "center",
  },
  confirmAddressText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
