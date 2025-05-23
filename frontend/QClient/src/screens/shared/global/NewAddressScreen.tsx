import React, { useState, useRef, useEffect } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { View, Text, StyleSheet, ActivityIndicator, Platform, TouchableOpacity } from "react-native";
import MapView, { Region } from "react-native-maps";
import useColorTheme from "src/hooks/useColorTheme";
import { useCurrentLocation } from "src/hooks/useCurrentLocation";
import logger from "src/utils/logger";
import SearchIconSvg from "src/components/svg/SearchIconSvg";
import { useNavigationAddress as useNavigationAddressQuery } from "src/api/hooks/queries/useNavigationAddress";
import { useDebounced } from "src/hooks/useDebounced";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NewAddressScreen() {
  logger.render("AddressesScreen");

  const colorTheme = useColorTheme();

  const { currentLocation: startLocation, permissionAllowed } = useCurrentLocation();
  const didFocusOnCurrentLocation = useRef(false);
  const didAnimateToRegion = useRef(false);
  const [region, setRegion] = useState<Region>({
    latitude: 45.4361,
    longitude: 28.0134,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const address = useNavigationAddressQuery(region.latitude, region.longitude);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    if (!didFocusOnCurrentLocation.current && permissionAllowed && !!startLocation) {
      didFocusOnCurrentLocation.current = true;
      setRegion(() => {
        const newRegion = {
          latitude: startLocation.coords.latitude,
          longitude: startLocation.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        mapRef.current?.animateToRegion(newRegion);
        return newRegion;
      });
    }
  }, [startLocation, permissionAllowed]);

  const debouncedSetRegion = useDebounced((newRegion: Region) => {
    setRegion(newRegion);
  }, 500);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={region}
        onRegionChangeComplete={(region) => {
          if (didFocusOnCurrentLocation.current && !didAnimateToRegion.current) {
            didAnimateToRegion.current = true;
            return;
          }
          debouncedSetRegion(region);
        }}
      />

      <SafeAreaView style={styles.floatingContainer} pointerEvents="box-none">
        <View
          style={[
            styles.addressContainer,
            {
              backgroundColor: colorTheme.background.primary,
              borderColor: colorTheme.text.primary,
              shadowColor: colorTheme.text.primary,
            },
          ]}
        >
          <View style={styles.iconContainer}>
            {address.isFetching ? (
              <ActivityIndicator size={32} color={colorTheme.text.primary} />
            ) : (
              <SearchIconSvg style={{ width: 40, height: 40 }} stroke={colorTheme.text.primary} />
            )}
          </View>
          <Text style={styles.addressText} numberOfLines={2}>
            {address.data}
          </Text>
        </View>

        <FontAwesome name="map-marker" size={48} color={colorTheme.background.accent} />

        {/* TODO: Implement address selection */}
        <TouchableOpacity
          style={[styles.selectAddressButton, { backgroundColor: colorTheme.background.accent }]}
          onPress={() => console.log("TODO")}
        >
          <Text style={[styles.selectAddressText, { color: colorTheme.text.onAccent }]}>
            Confirmați adresa
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  floatingContainer: {
    position: "absolute",
    height: "100%",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  addressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderRadius: 12,
    ...Platform.select({
      android: {
        elevation: 12,
      },
      default: {
        shadowOpacity: 1,
        shadowRadius: 12,
        elevation: 12,
      },
    }),
  },
  iconContainer: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  addressText: {
    fontSize: 16,
    fontWeight: "bold",
    flexGrow: 1,
    flexShrink: 1,
  },
  selectAddressButton: {
    borderRadius: 9999,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  selectAddressText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
