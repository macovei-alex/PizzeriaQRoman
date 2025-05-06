import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import LabelledBorderComponent from "src/components/shared/generic/LabelledBorderComponent";
import { useAuthContext } from "src/context/AuthContext";
import useColorTheme from "src/hooks/useColorTheme";

export default function AccountForm() {
  const authContext = useAuthContext();
  if (!authContext.account) throw new Error("Account not found in context");
  const colorTheme = useColorTheme();

  const [accountData, setAccountData] = useState({
    givenName: authContext.account.givenName,
    familyName: authContext.account.familyName,
    email: authContext.account.email,
    phone: "0733983257",
  });

  return (
    <View style={styles.container}>
      {/* first name */}
      <LabelledBorderComponent
        label="Prenume"
        style={{ backgroundColor: colorTheme.background.primary }}
        containerStyle={styles.labelledBorderContainer}
        labelStyle={styles.inputLabel}
      >
        <TextInput
          value={accountData.givenName}
          onChangeText={(text) => setAccountData({ ...accountData, givenName: text })}
          style={styles.input}
        />
      </LabelledBorderComponent>

      {/* last name */}
      <LabelledBorderComponent
        label="Nume de familie"
        style={{ backgroundColor: colorTheme.background.primary }}
        containerStyle={styles.labelledBorderContainer}
        labelStyle={styles.inputLabel}
      >
        <TextInput
          value={accountData.familyName}
          onChangeText={(text) => setAccountData({ ...accountData, familyName: text })}
          style={styles.input}
        />
      </LabelledBorderComponent>

      {/* email */}
      <LabelledBorderComponent
        label="Email"
        style={{ backgroundColor: colorTheme.background.primary }}
        containerStyle={styles.labelledBorderContainer}
        labelStyle={styles.inputLabel}
      >
        <TextInput
          value={authContext.account.email}
          onChangeText={(text) => setAccountData({ ...accountData, email: text })}
          style={styles.input}
        />
      </LabelledBorderComponent>

      {/* phone number */}
      <LabelledBorderComponent
        label="Număr de telefon"
        style={{ backgroundColor: colorTheme.background.primary }}
        containerStyle={[styles.labelledBorderContainer, styles.phoneNumberContainerStyle]}
        labelStyle={styles.inputLabel}
      >
        <Text style={styles.phoneNumberPrefix}>+40</Text>
        <TextInput
          style={styles.input}
          value={accountData.phone}
          onChangeText={(text) => setAccountData({ ...accountData, phone: text })}
        />
      </LabelledBorderComponent>

      <TouchableOpacity style={[styles.button, { backgroundColor: colorTheme.background.accent }]}>
        <Text style={[styles.buttonText, { color: colorTheme.text.onAccent }]}>Salvați modificările</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelledBorderContainer: {
    borderWidth: 1.5,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "400",
  },
  input: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 10,
  },
  phoneNumberContainerStyle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  phoneNumberPrefix: {
    fontSize: 18,
    marginLeft: 10,
  },
  button: {
    padding: 12,
    borderRadius: 12,
    marginTop: 16,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "400",
  },
});
