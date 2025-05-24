import React, { useState } from "react";
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import useColorTheme from "src/hooks/useColorTheme";
import LabelledBorderComponent from "src/components/shared/generic/LabelledBorderComponent";
import logger from "src/utils/logger";

export type NewAddress = {
  baseString: string;
  block: string;
  floor: string;
  apartment: string;
};

type ModalFormProps = {
  initialState: NewAddress;
  onClose: (newAddress: NewAddress, doSend: boolean) => void;
};

export default function AddressForm({ initialState, onClose }: ModalFormProps) {
  logger.render("AddressForm");

  const colorTheme = useColorTheme();
  const [modalState, setModalState] = useState<NewAddress>(initialState);

  const sendModalData = () => onClose(modalState, true);
  const closeModal = () => onClose(modalState, false);

  return (
    <Modal transparent visible animationType="slide" onRequestClose={closeModal}>
      <TouchableOpacity style={styles.modalBackdrop} onPress={closeModal} />
      <View style={[styles.modalContent, { backgroundColor: colorTheme.background.primary }]}>
        {/* Title */}
        <Text style={styles.modalTitle}>Confirmați adresa</Text>

        {/* Inputs */}
        <LabelledBorderComponent label="Adresa de bază">
          <TextInput
            value={modalState.baseString}
            onChangeText={(text) => setModalState({ ...modalState, baseString: text })}
            multiline
            numberOfLines={3}
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
          onPress={sendModalData}
        >
          <Text style={[styles.confirmAddressText, { color: colorTheme.text.onAccent }]}>Salvați adresa</Text>
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
    paddingVertical: 12,
    marginTop: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  confirmAddressText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
