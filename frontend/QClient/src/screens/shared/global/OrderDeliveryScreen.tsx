import React, { useState } from "react";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import ErrorComponent from "src/components/shared/generic/ErrorComponent";
import ScreenActivityIndicator from "src/components/shared/generic/ScreenActivityIndicator";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import useColorTheme from "src/hooks/useColorTheme";
import logger from "src/utils/logger";
import HomeIconSvg from "src/components/svg/HomeIconSvg";
import CartIconSvg from "src/components/svg/CartIconSvg";
import { useDirectionsQuery } from "src/api/hooks/queries/useDirectionsQuery";
import { RootStackParamList } from "src/navigation/RootStackNavigator";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { mapsCoordinatesManualOptions } from "src/api/hooks/options/mapsCoordinatesManualOptions";
import { useFullOrderQuery } from "src/api/hooks/queries/useFullOrderQuery";
import useRestaurantLocationQuery from "src/api/hooks/queries/useRestaurantLocation";

type RouteProps = RouteProp<RootStackParamList, "OrderDeliveryScreen">;

export default function OrderDeliveryScreen() {
  logger.render("OrderDeliveryScreen");

  const colorTheme = useColorTheme();
  const route = useRoute<RouteProps>();
  const restaurantLocationQuery = useRestaurantLocationQuery();
  const fullOrderQuery = useFullOrderQuery(route.params.orderId);
  const deliveryCoordinatesQuery = useQuery(
    mapsCoordinatesManualOptions(fullOrderQuery.data?.address.addressString, !!fullOrderQuery.data)
  );
  const restaurantLocation = restaurantLocationQuery.data
    ? {
        latitude: restaurantLocationQuery.data.lat,
        longitude: restaurantLocationQuery.data.lng,
      }
    : undefined;
  const deliveryLocation = deliveryCoordinatesQuery.data
    ? {
        latitude: deliveryCoordinatesQuery.data.lat,
        longitude: deliveryCoordinatesQuery.data.lng,
      }
    : undefined;
  const directionsQuery = useDirectionsQuery(deliveryLocation, restaurantLocation);
  const [isLoaded, setIsLoaded] = useState(false);

  if (
    restaurantLocationQuery.isFetching ||
    fullOrderQuery.isFetching ||
    deliveryCoordinatesQuery.isFetching ||
    directionsQuery.isFetching
  )
    return <ScreenActivityIndicator />;

  if (
    restaurantLocationQuery.isError ||
    fullOrderQuery.isError ||
    deliveryCoordinatesQuery.isError ||
    directionsQuery.isError
  )
    return (
      <ErrorComponent
        onRetry={() => {
          restaurantLocationQuery.refetch();
          fullOrderQuery.refetch();
          deliveryCoordinatesQuery.refetch();
          directionsQuery.refetch();
        }}
      />
    );

  if (!restaurantLocation) throw new Error("Restaurant location is not defined in OrderDeliveryScreen");
  if (!deliveryLocation) throw new Error("Delivery location is not defined in OrderDeliveryScreen");

  const points = directionsQuery.data;

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        onMapLoaded={() => setIsLoaded(true)}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={{
          latitude: deliveryLocation.latitude,
          longitude: deliveryLocation.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
      >
        <Marker
          tracksViewChanges={!isLoaded}
          coordinate={{
            latitude: deliveryLocation.latitude,
            longitude: deliveryLocation.longitude,
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
            latitude: restaurantLocation.latitude,
            longitude: restaurantLocation.longitude,
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
