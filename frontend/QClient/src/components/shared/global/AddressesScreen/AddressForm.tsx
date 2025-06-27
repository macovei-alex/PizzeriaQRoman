import React, { useState } from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import LabelledBorderComponent from "src/components/shared/generic/LabelledBorderComponent";
import logger from "src/constants/logger";

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

  const [modalState, setModalState] = useState<NewAddress>(initialState);

  const sendModalData = () => onClose(modalState, true);
  const closeModal = () => onClose(modalState, false);

  return (
    <>
      <View style={styles.modalBackdrop} />
      <Modal transparent visible animationType="slide" onRequestClose={closeModal}>
        <TouchableOpacity style={styles.closeModalArea} onPress={closeModal} />
        <View style={styles.modalContent}>
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
          <TouchableOpacity style={styles.confirmAddressButton} onPress={sendModalData}>
            <Text style={styles.confirmAddressText}>Salvați adresa</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create((theme) => ({
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  closeModalArea: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
  },
  modalContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    backgroundColor: theme.background.primary,
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
    backgroundColor: theme.background.accent,
  },
  confirmAddressText: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.text.onAccent,
  },
}));
