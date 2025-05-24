import React, {
  ForwardedRef,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { api } from "src/api";
import { usePhoneNumberQuery } from "src/api/hooks/queries/usePhoneNumberQuery";
import ErrorComponent from "src/components/shared/generic/ErrorComponent";
import LabelledBorderComponent from "src/components/shared/generic/LabelledBorderComponent";
import { useAuthContext } from "src/context/AuthContext";
import useColorTheme from "src/hooks/useColorTheme";
import logger from "src/utils/logger";
import { showToast } from "src/utils/toast";

export type AccountFormHandle = {
  handleRefresh: () => Promise<void>;
};

function AccountForm(props: object, ref: ForwardedRef<AccountFormHandle>) {
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
  const resetAccountData = useCallback(
    () =>
      setAccountData({
        firstName: account.givenName,
        lastName: account.familyName,
        email: account.email,
        phoneNumber: phoneNumberQuery.data ?? "",
      }),
    [account, phoneNumberQuery.data]
  );
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

  const handleInfoUpdate = useCallback(async () => {
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
  }, [authContext, account, accountData, phoneNumberQuery, resetAccountData]);

  if (phoneNumberQuery.isError) return <ErrorComponent size="small" />;

  const isLoading = phoneNumberQuery.isFetching || updatingInfo;
  const textColor = isLoading ? colorTheme.text.disabled : colorTheme.text.primary;
  const borderColor = isLoading ? colorTheme.text.disabled : colorTheme.text.primary;
  const buttonsOpacity = isLoading ? 0.5 : 1;

  return (
    <View style={styles.container} pointerEvents={isLoading ? "none" : "auto"}>
      <View>
        {isLoading && (
          <ActivityIndicator size={48} color={colorTheme.background.accent} style={styles.spinner} />
        )}

        {/* first name */}
        <LabelledBorderComponent
          label="Prenume"
          style={{ backgroundColor: colorTheme.background.primary }}
          containerStyle={[styles.labelledBorderContainer, { borderColor }]}
          labelStyle={styles.inputLabel}
        >
          <TextInput
            value={accountData.firstName}
            onChangeText={(text) => setAccountData({ ...accountData, firstName: text })}
            style={[styles.input, { color: textColor }]}
          />
        </LabelledBorderComponent>

        {/* last name */}
        <LabelledBorderComponent
          label="Nume de familie"
          style={{ backgroundColor: colorTheme.background.primary }}
          containerStyle={[styles.labelledBorderContainer, { borderColor }]}
          labelStyle={styles.inputLabel}
        >
          <TextInput
            value={accountData.lastName}
            onChangeText={(text) => setAccountData({ ...accountData, lastName: text })}
            style={[styles.input, { color: textColor }]}
          />
        </LabelledBorderComponent>

        {/* email */}
        <LabelledBorderComponent
          label="Email"
          style={{ backgroundColor: colorTheme.background.primary }}
          containerStyle={[styles.labelledBorderContainer, { borderColor }]}
          labelStyle={styles.inputLabel}
        >
          <TextInput
            value={accountData.email}
            onChangeText={(text) => setAccountData({ ...accountData, email: text })}
            style={[styles.input, { color: textColor }]}
          />
        </LabelledBorderComponent>
        {/* phone number */}
        <LabelledBorderComponent
          label="Număr de telefon"
          style={{ backgroundColor: colorTheme.background.primary }}
          containerStyle={[styles.labelledBorderContainer, styles.phoneNumberContainerStyle, { borderColor }]}
          labelStyle={styles.inputLabel}
        >
          <Text style={[styles.phoneNumberPrefix, { color: textColor }]}>+40</Text>
          <TextInput
            style={[styles.input, { color: textColor }]}
            value={accountData.phoneNumber}
            onChangeText={(text) => setAccountData({ ...accountData, phoneNumber: text })}
          />
        </LabelledBorderComponent>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colorTheme.background.accent, opacity: buttonsOpacity }]}
          disabled={isLoading}
          onPress={handleInfoUpdate}
          activeOpacity={0.6}
        >
          <Text style={[styles.buttonText, { color: colorTheme.text.onAccent }]}>Salvați</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colorTheme.background.accent, opacity: buttonsOpacity }]}
          disabled={isLoading}
          onPress={resetAccountData}
          activeOpacity={0.6}
        >
          <Text style={[styles.buttonText, { color: colorTheme.text.onAccent }]}>Resetați</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default forwardRef<AccountFormHandle>(AccountForm);

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  spinner: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
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
