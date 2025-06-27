import React, { useState, useRef, useEffect, useCallback } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { View, Text, ActivityIndicator, Platform, TouchableOpacity } from "react-native";
import { StyleSheet, withUnistyles } from "react-native-unistyles";
import MapView from "react-native-maps";
import { useCurrentLocation } from "src/hooks/useCurrentLocation";
import logger from "src/constants/logger";
import SearchIconSvg from "src/components/svg/SearchIconSvg";
import AddressForm, { NewAddress } from "src/components/shared/global/AddressesScreen/AddressForm";
import { api } from "src/api";
import { useAuthContext } from "src/context/AuthContext";
import { CreatedAddress } from "src/api/types/Address";
import { useBidirectionalAddressRegionUpdates } from "src/components/shared/global/AddressesScreen/useBidirectionalAddressRegionUpdates";
import { showToast } from "src/utils/toast";
import { useNavigation } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";

export default function NewAddressScreen() {
  logger.render("NewAddressScreen");

  const accountId = useAuthContext().account?.id;
  if (!accountId) throw new Error("Account is not defined in NewAddressScreen");
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const mapRef = useRef<MapView>(null);
  const [screenState, setScreenState] = useState<"modal-closed" | "modal-open" | "sending">("modal-closed");
  const { region, setRegion, fetchingAddress, address, setAddress } =
    useBidirectionalAddressRegionUpdates(mapRef);
  const shouldSetNewRegion = useRef(false);

  const { currentLocation: startLocation, permissionAllowed } = useCurrentLocation();
  const isStartLocationLoaded = useRef(false);

  useEffect(() => {
    if (isStartLocationLoaded.current || !startLocation || !permissionAllowed) return;
    const newRegion = {
      latitude: startLocation.coords.latitude,
      longitude: startLocation.coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
    setRegion(newRegion);
    mapRef.current?.animateToRegion(newRegion);
    isStartLocationLoaded.current = true;
    shouldSetNewRegion.current = false;
  }, [startLocation, permissionAllowed, setRegion]);

  const handleAddressFormClose = useCallback(
    (newAddress: NewAddress, doSend: boolean) => {
      setScreenState("modal-closed");
      if (address !== newAddress.baseString) {
        setAddress(newAddress.baseString);
        shouldSetNewRegion.current = false;
      }
      if (!doSend) return;

      setScreenState("sending");
      api.axios
        .post<any, any, CreatedAddress>(api.routes.account(accountId).addresses, {
          addressString:
            newAddress.baseString +
            (newAddress.block ? ", Blocul " + newAddress.block : "") +
            (newAddress.floor ? ", Etajul " + newAddress.floor : "") +
            (newAddress.apartment ? ", Apartamentul " + newAddress.apartment : ""),
          primary: true,
        })
        .then(() => {
          showToast("Adresa a fost salvată");
          queryClient.invalidateQueries({ queryKey: ["addresses"] });
          navigation.goBack();
        })
        .catch((error) => {
          showToast("Adresa nu a putut fi salvată din cauza unei erori");
          logger.error(error);
        })
        .finally(() => setScreenState("modal-closed"));
    },
    [accountId, address, setAddress, queryClient, navigation]
  );

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={region}
        onRegionChangeComplete={(newRegion) => {
          if (shouldSetNewRegion.current) setRegion(newRegion);
          else shouldSetNewRegion.current = true;
        }}
      />

      <View style={styles.floatingContainer} pointerEvents="box-none">
        <View style={styles.addressContainer}>
          <View style={styles.iconContainer}>
            {fetchingAddress ? (
              <UFetchingActivityIndicator size={32} />
            ) : (
              <USearchIconSvg style={styles.searchIcon} />
            )}
          </View>
          <Text style={styles.addressText} numberOfLines={2}>
            {address}
          </Text>
        </View>

        <UFontAwesome name="map-marker" size={48} />

        <TouchableOpacity style={styles.selectAddressButton} onPress={() => setScreenState("modal-open")}>
          <Text style={styles.selectAddressText}>Adăugați detalii</Text>
        </TouchableOpacity>
      </View>

      {screenState === "modal-open" && (
        <AddressForm
          initialState={{ baseString: address, block: "", floor: "", apartment: "" }}
          onClose={handleAddressFormClose}
        />
      )}

      {screenState === "sending" && (
        <View style={styles.loadingContainer}>
          <USendingActivityIndicator size={80} />
        </View>
      )}
    </View>
  );
}

const UFetchingActivityIndicator = withUnistyles(ActivityIndicator, (theme) => ({
  color: theme.text.primary,
}));

const USearchIconSvg = withUnistyles(SearchIconSvg, (theme) => ({
  stroke: theme.text.primary,
}));

const UFontAwesome = withUnistyles(FontAwesome, (theme) => ({
  color: theme.text.accent,
}));

const USendingActivityIndicator = withUnistyles(ActivityIndicator, (theme) => ({
  color: theme.text.accent,
}));

const styles = StyleSheet.create((theme, runtime) => ({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  floatingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: runtime.insets.top + 16,
    paddingBottom: runtime.insets.bottom + 16,
    paddingHorizontal: 16,
  },
  addressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderRadius: 12,
    backgroundColor: theme.background.primary,
    borderColor: theme.text.primary,
    shadowColor: theme.text.primary,
    ...Platform.select({
      android: {
        elevation: 12,
      },
      default: {
        shadowOpacity: 1,
        shadowRadius: 12,
      },
    }),
  },
  iconContainer: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  searchIcon: {
    width: 40,
    height: 40,
  },
  addressText: {
    fontSize: 16,
    fontWeight: "bold",
    flexGrow: 1,
    flexShrink: 1,
  },
  selectAddressButton: {
    width: "100%",
    alignItems: "center",
    borderRadius: 12,
    paddingVertical: 12,
    backgroundColor: theme.background.accent,
  },
  selectAddressText: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.text.onAccent,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
}));
