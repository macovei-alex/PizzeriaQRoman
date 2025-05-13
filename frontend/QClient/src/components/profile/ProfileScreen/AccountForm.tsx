import React, { useCallback, useLayoutEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { api } from "src/api";
import { usePhoneNumberQuery } from "src/api/hooks/usePhoneNumberQuery";
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
          value={accountData.lastName}
          onChangeText={(text) => setAccountData({ ...accountData, lastName: text })}
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
          value={accountData.email}
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
          value={accountData.phoneNumber}
          onChangeText={(text) => setAccountData({ ...accountData, phoneNumber: text })}
        />
      </LabelledBorderComponent>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colorTheme.background.accent }]}
        disabled={updatingInfo}
        onPress={handleInfoUpdate}
      >
        {updatingInfo ? (
          <ActivityIndicator size={27} color={colorTheme.text.onAccent} />
        ) : (
          <Text style={[styles.buttonText, { color: colorTheme.text.onAccent }]}>Salvați modificările</Text>
        )}
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
    flexGrow: 1,
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
