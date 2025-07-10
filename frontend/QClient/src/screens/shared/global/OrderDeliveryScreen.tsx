import React, { useState } from "react";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import ErrorComponent from "src/components/shared/generic/ErrorComponent";
import ScreenActivityIndicator from "src/components/shared/generic/ScreenActivityIndicator";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, withUnistyles } from "react-native-unistyles";
import logger from "src/constants/logger";
import HomeIconSvg from "src/components/svg/HomeIconSvg";
import CartIconSvg from "src/components/svg/CartIconSvg";
import { useDirectionsQuery } from "src/api/queries/directionsQuery";
import { RootStackParamList } from "src/navigation/RootStackNavigator";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { mapsCoordinatesManualOptions } from "src/api/queries/mapsCoordinatesManualQuery";
import { useFullOrderQuery } from "src/api/queries/fullOrderQuery";
import useRestaurantConstantsQuery from "src/api/queries/restaurantConstantsQuery";

type RouteProps = RouteProp<RootStackParamList, "OrderDeliveryScreen">;

export default function OrderDeliveryScreen() {
  logger.render("OrderDeliveryScreen");

  const route = useRoute<RouteProps>();
  const restaurantConstantsQuery = useRestaurantConstantsQuery();
  const fullOrderQuery = useFullOrderQuery(route.params.orderId);
  const deliveryCoordinatesQuery = useQuery(
    mapsCoordinatesManualOptions(fullOrderQuery.data?.address.addressString, !!fullOrderQuery.data)
  );
  const restaurantLocation = restaurantConstantsQuery.data
    ? {
        latitude: restaurantConstantsQuery.data.location.lat,
        longitude: restaurantConstantsQuery.data.location.lng,
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
    restaurantConstantsQuery.isFetching ||
    fullOrderQuery.isFetching ||
    deliveryCoordinatesQuery.isFetching ||
    directionsQuery.isFetching
  )
    return <ScreenActivityIndicator />;

  if (
    restaurantConstantsQuery.isError ||
    fullOrderQuery.isError ||
    deliveryCoordinatesQuery.isError ||
    directionsQuery.isError
  )
    return (
      <ErrorComponent
        onRetry={() => {
          restaurantConstantsQuery.refetch();
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
          <UHomeIconSvg style={styles.svgIcons} />
        </Marker>
        <Marker
          tracksViewChanges={!isLoaded}
          coordinate={{
            latitude: restaurantLocation.latitude,
            longitude: restaurantLocation.longitude,
          }}
          title="Restaurant PizzeriaQ"
        >
          <UCartIconSvg style={styles.svgIcons} />
        </Marker>
        {points && points.length > 0 && <Polyline coordinates={points} strokeWidth={4} strokeColor="red" />}
      </MapView>
    </SafeAreaView>
  );
}

const UHomeIconSvg = withUnistyles(HomeIconSvg, (theme) => ({
  stroke: theme.text.onAccent,
  fillPrimary: theme.background.accent,
  fillSecondary: theme.background.accent,
}));

const UCartIconSvg = withUnistyles(CartIconSvg, (theme) => ({
  stroke: theme.text.onAccent,
  fillPrimary: theme.background.accent,
  fillSecondary: theme.background.accent,
}));

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
