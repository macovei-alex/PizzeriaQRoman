import React, { ForwardedRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from "react-native";
import { StyleSheet, withUnistyles } from "react-native-unistyles";
import { api } from "src/api";
import { usePhoneNumberQuery } from "src/api/queries/phoneNumberQuery";
import ErrorComponent from "src/components/shared/generic/ErrorComponent";
import LabelledBorderComponent from "src/components/shared/generic/LabelledBorderComponent";
import { useAuthContext } from "src/context/AuthContext";
import logger from "src/constants/logger";
import { showToast } from "src/utils/toast";

export type AccountFormHandle = {
  handleRefresh: () => Promise<void>;
};

type AccountFormProps = {
  ref: ForwardedRef<AccountFormHandle>;
};

export default function AccountForm({ ref }: AccountFormProps) {
  logger.render("AccountForm");

  const authContext = useAuthContext();
  if (!authContext.account) throw new Error("Account not found in context");
  const account = authContext.account;

  const phoneNumberQuery = usePhoneNumberQuery(account.id);
  const [accountData, setAccountData] = useState({
    firstName: account.givenName,
    lastName: account.familyName,
    email: account.email,
    phoneNumber: phoneNumberQuery.data ?? "",
  });
  const resetAccountData = () =>
    setAccountData({
      firstName: account.givenName,
      lastName: account.familyName,
      email: account.email,
      phoneNumber: phoneNumberQuery.data ?? "",
    });
  const [updatingInfo, setUpdatingInfo] = useState(false);
  const abortController = useRef<AbortController | null>(null);

  useImperativeHandle(ref, () => {
    return {
      handleRefresh: async () => {
        if (abortController.current) abortController.current.abort();
        await authContext.tryRefreshTokens();
        await phoneNumberQuery
          .refetch()
          .then((result) => setAccountData((prev) => ({ ...prev, phoneNumber: result.data ?? "" })));
      },
    };
  });

  useEffect(
    () => setAccountData((prev) => ({ ...prev, phoneNumber: phoneNumberQuery.data ?? "" })),
    [phoneNumberQuery.data]
  );

  const handleInfoUpdate = async () => {
    setUpdatingInfo(true);
    try {
      if (abortController.current) abortController.current.abort();
      abortController.current = new AbortController();
      await api.axios.put(api.routes.account(account.id).self, accountData, {
        signal: abortController.current.signal,
      });
      await authContext.tryRefreshTokens();
      await phoneNumberQuery.refetch();
    } catch (error) {
      await phoneNumberQuery.refetch();
      showToast("Eroare la actualizarea datelor");
      logger.error("Error updating account data", error);
      resetAccountData();
    } finally {
      setUpdatingInfo(false);
      abortController.current = null;
    }
  };

  if (phoneNumberQuery.isError) return <ErrorComponent size="small" />;

  const isLoading = phoneNumberQuery.isFetching || updatingInfo;
  const buttonsOpacity = isLoading ? 0.5 : 1;

  return (
    <View style={styles.container} pointerEvents={isLoading ? "none" : "auto"}>
      <View>
        {isLoading && <UActivityIndicator size={48} style={styles.spinner} />}

        {/* first name */}
        <LabelledBorderComponent
          label="Prenume"
          style={styles.labelledBorderStyle}
          containerStyle={styles.labelledBorderContainer(isLoading)}
          labelStyle={styles.inputLabel}
        >
          <TextInput
            value={accountData.firstName}
            onChangeText={(text) => setAccountData({ ...accountData, firstName: text })}
            style={styles.input(isLoading)}
          />
        </LabelledBorderComponent>

        {/* last name */}
        <LabelledBorderComponent
          label="Nume de familie"
          style={styles.labelledBorderStyle}
          containerStyle={styles.labelledBorderContainer(isLoading)}
          labelStyle={styles.inputLabel}
        >
          <TextInput
            value={accountData.lastName}
            onChangeText={(text) => setAccountData({ ...accountData, lastName: text })}
            style={styles.input(isLoading)}
          />
        </LabelledBorderComponent>

        {/* email */}
        <LabelledBorderComponent
          label="Email"
          style={styles.labelledBorderStyle}
          containerStyle={styles.labelledBorderContainer(isLoading)}
          labelStyle={styles.inputLabel}
        >
          <TextInput
            value={accountData.email}
            onChangeText={(text) => setAccountData({ ...accountData, email: text })}
            style={styles.input(isLoading)}
          />
        </LabelledBorderComponent>
        {/* phone number */}
        <LabelledBorderComponent
          label="Număr de telefon"
          style={styles.labelledBorderStyle}
          containerStyle={[styles.labelledBorderContainer(isLoading), styles.phoneNumberContainerStyle]}
          labelStyle={styles.inputLabel}
        >
          <Text style={styles.phoneNumberPrefix(isLoading)}>+40</Text>
          <TextInput
            style={styles.input(isLoading)}
            value={accountData.phoneNumber}
            onChangeText={(text) => setAccountData({ ...accountData, phoneNumber: text })}
          />
        </LabelledBorderComponent>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, { opacity: buttonsOpacity }]}
          disabled={isLoading}
          onPress={handleInfoUpdate}
          activeOpacity={0.6}
        >
          <Text style={styles.buttonText}>Salvați</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { opacity: buttonsOpacity }]}
          disabled={isLoading}
          onPress={resetAccountData}
          activeOpacity={0.6}
        >
          <Text style={styles.buttonText}>Resetați</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const UActivityIndicator = withUnistyles(ActivityIndicator, (theme) => ({
  color: theme.background.accent,
}));

const styles = StyleSheet.create((theme) => ({
  container: {
    marginBottom: 16,
  },
  spinner: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  labelledBorderStyle: {
    backgroundColor: theme.background.primary,
  },
  labelledBorderContainer: (isLoading: boolean) => ({
    borderWidth: 1.5,
    paddingHorizontal: 20,
    marginBottom: 8,
    borderColor: isLoading ? theme.text.disabled : theme.text.primary,
  }),
  inputLabel: {
    fontSize: 14,
    fontWeight: "400",
  },
  input: (isLoading: boolean) => ({
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 10,
    color: isLoading ? theme.text.disabled : theme.text.primary,
  }),
  phoneNumberContainerStyle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  phoneNumberPrefix: (isLoading: boolean) => ({
    fontSize: 18,
    marginLeft: 10,
    color: isLoading ? theme.text.disabled : theme.text.primary,
  }),
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
    backgroundColor: theme.background.accent,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "400",
    color: theme.text.onAccent,
  },
}));
