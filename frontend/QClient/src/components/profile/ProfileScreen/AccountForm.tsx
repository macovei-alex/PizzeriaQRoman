import React, { useCallback, useLayoutEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { api } from "src/api";
import { usePhoneNumberQuery } from "src/api/hooks/queries/usePhoneNumberQuery";
import ErrorComponent from "src/components/shared/generic/ErrorComponent";
import LabelledBorderComponent from "src/components/shared/generic/LabelledBorderComponent";
import ScreenActivityIndicator from "src/components/shared/generic/ScreenActivityIndicator";
import { useAuthContext } from "src/context/AuthContext";
import useColorTheme from "src/hooks/useColorTheme";
import logger from "src/utils/logger";

export default function AccountForm() {
  const authContext = useAuthContext();
  if (!authContext.account) throw new Error("Account not found in context");
  const account = authContext.account;
  const colorTheme = useColorTheme();
  const phoneNumberQuery = usePhoneNumberQuery(account.id);
  const [accountData, setAccountData] = useState({
    firstName: account.givenName,
    lastName: account.familyName,
    email: account.email,
    phoneNumber: phoneNumberQuery.data ?? "",
  });
  const [updatingInfo, setUpdatingInfo] = useState(false);

  useLayoutEffect(() => {
    setAccountData((prev) => {
      return { ...prev, phoneNumber: phoneNumberQuery.data ?? "" };
    });
  }, [phoneNumberQuery.data]);

  const handleInfoUpdate = useCallback(async () => {
    setUpdatingInfo(true);
    try {
      await api.axios.put(api.routes.account(account.id).self, accountData);
      await authContext.tryRefreshTokens();
    } catch (error) {
      logger.error("Error updating account data", error);
      setAccountData({
        firstName: account.givenName,
        lastName: account.familyName,
        email: account.email,
        phoneNumber: phoneNumberQuery.data ?? "",
      });
      phoneNumberQuery.refetch();
    } finally {
      setUpdatingInfo(false);
    }
  }, [authContext, account, accountData, phoneNumberQuery]);

  if (phoneNumberQuery.isFetching) return <ScreenActivityIndicator />;
  if (phoneNumberQuery.isError) return <ErrorComponent size="small" />;

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
          value={accountData.firstName}
          onChangeText={(text) => setAccountData({ ...accountData, firstName: text })}
          style={[styles.input, { color: colorTheme.text.primary }]}
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
          value={accountData.lastName}
          onChangeText={(text) => setAccountData({ ...accountData, lastName: text })}
          style={[styles.input, { color: colorTheme.text.primary }]}
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
          value={accountData.email}
          onChangeText={(text) => setAccountData({ ...accountData, email: text })}
          style={[styles.input, { color: colorTheme.text.primary }]}
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
          style={[styles.input, { color: colorTheme.text.primary }]}
          value={accountData.phoneNumber}
          onChangeText={(text) => setAccountData({ ...accountData, phoneNumber: text })}
        />
      </LabelledBorderComponent>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colorTheme.background.accent }]}
          disabled={updatingInfo}
          onPress={handleInfoUpdate}
        >
          {updatingInfo ? (
            <ActivityIndicator size={27} color={colorTheme.text.onAccent} />
          ) : (
            <Text style={[styles.buttonText, { color: colorTheme.text.onAccent }]}>Salvați</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colorTheme.background.accent }]}
          disabled={updatingInfo}
          onPress={handleInfoUpdate}
        >
          {updatingInfo ? (
            <ActivityIndicator size={27} color={colorTheme.text.onAccent} />
          ) : (
            <Text style={[styles.buttonText, { color: colorTheme.text.onAccent }]}>Resetați</Text>
          )}
        </TouchableOpacity>
      </View>
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
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "400",
  },
  input: {
    flex: 1,
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
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginTop: 16,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "400",
  },
});
