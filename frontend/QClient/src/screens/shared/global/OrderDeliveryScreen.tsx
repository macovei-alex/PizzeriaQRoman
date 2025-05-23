import React, { useState } from "react";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import ErrorComponent from "src/components/shared/generic/ErrorComponent";
import ScreenActivityIndicator from "src/components/shared/generic/ScreenActivityIndicator";
import { useCurrentLocation } from "src/hooks/useCurrentLocation";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import useColorTheme from "src/hooks/useColorTheme";
import logger from "src/utils/logger";
import HomeIconSvg from "src/components/svg/HomeIconSvg";
import CartIconSvg from "src/components/svg/CartIconSvg";
import { useDirectionsQuery } from "src/api/hooks/queries/useDirectionsQuery";
import PermissionDenied from "src/components/shared/generic/PermissionDenied";

const DESTINATION = {
  latitude: 45.46958477253526,
  longitude: 28.033678383941893,
};

export default function OrderDeliveryScreen() {
  logger.render("OrderDeliveryScreen");

  const colorTheme = useColorTheme();
  const { currentLocation, permissionAllowed } = useCurrentLocation();
  const directionsQuery = useDirectionsQuery(currentLocation?.coords, DESTINATION);
  const [isLoaded, setIsLoaded] = useState(false);

  if (!permissionAllowed) {
    return <PermissionDenied text="Vă rugăm să permiteți accesul la locație pentru a urmări livrarea." />;
  }
  if (currentLocation === null || directionsQuery.isLoading) return <ScreenActivityIndicator />;
  if (directionsQuery.isError) return <ErrorComponent onRetry={directionsQuery.refetch} />;

  const points = directionsQuery.data;

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        onMapLoaded={() => setIsLoaded(true)}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={{
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
      >
        <Marker
          tracksViewChanges={!isLoaded}
          coordinate={{
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
          }}
          title="Adresa ta"
        >
          <HomeIconSvg
            style={styles.svgIcons}
            stroke={colorTheme.text.onAccent}
            fillPrimary={colorTheme.background.accent}
            fillSecondary={colorTheme.background.accent}
          />
        </Marker>
        <Marker
          tracksViewChanges={!isLoaded}
          coordinate={{
            latitude: DESTINATION.latitude,
            longitude: DESTINATION.longitude,
          }}
          title="Restaurant PizzeriaQ"
        >
          <CartIconSvg
            style={styles.svgIcons}
            stroke={colorTheme.text.onAccent}
            fillPrimary={colorTheme.background.accent}
            fillSecondary={colorTheme.background.accent}
          />
        </Marker>
        {points && points.length > 0 && <Polyline coordinates={points} strokeWidth={4} strokeColor="red" />}
      </MapView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  svgIcons: {
    width: 30,
    height: 30,
  },
  button: {
    padding: 20,
    borderRadius: 9999,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
  },
});
