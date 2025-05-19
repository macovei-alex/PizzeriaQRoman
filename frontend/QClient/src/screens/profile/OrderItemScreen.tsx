import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useColorTheme from "src/hooks/useColorTheme";
import { Fragment } from "react";
import logger from "src/utils/logger";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import ErrorComponent from "src/components/shared/generic/ErrorComponent";
import ScreenActivityIndicator from "src/components/shared/generic/ScreenActivityIndicator";
import { ProfileStackParamList } from "src/navigation/ProfileStackNavigator";
import { useFullOrderQuery } from "src/api/hooks/queries/useFullOrderQuery";
import HorizontalLine from "src/components/shared/generic/HorizontalLine";
import OptionListCard from "src/components/profile/OrderItemScreen/OptionListCard";
import { OptionId, OptionListId } from "src/api/types/Product";
import RemoteImageBackground from "src/components/shared/generic/RemoteImageBackground";
import GoBackButtonSvg from "src/components/svg/GoBackButtonSvg";
import { formatPrice } from "src/utils/utils";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type NavigationProps = NativeStackNavigationProp<ProfileStackParamList, "OrderItemScreen">;

type RouteProps = RouteProp<ProfileStackParamList, "OrderItemScreen">;

export default function OrderItemScreen() {
  logger.render("OrderItemScreen");

  const colorTheme = useColorTheme();
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<RouteProps>();
  const orderQuery = useFullOrderQuery(route.params.orderId);

  const item = useMemo(() => {
    if (!orderQuery.data) return null;
    const item = orderQuery.data?.items.find((item) => item.id === route.params.itemId);
    if (!item) throw new Error(`Item not found for id ( ${route.params.itemId} )`);
    return item;
  }, [orderQuery.data, route.params.itemId]);

  const selectedOptions = useMemo(() => {
    if (!item) return null;
    const selectedOptions: Record<OptionListId, Record<OptionId, number>> = {};
    for (const { optionListId, optionId, count } of item.options) {
      if (!selectedOptions[optionListId]) {
        selectedOptions[optionListId] = {};
      }
      selectedOptions[optionListId][optionId] = count;
    }
    return selectedOptions;
  }, [item]);

  if (orderQuery.isFetching) return <ScreenActivityIndicator />;
  if (orderQuery.isError) return <ErrorComponent />;
  if (!orderQuery.data) throw new Error("Something went wrong: no order data found");

  if (!item || !selectedOptions) throw new Error(`Item not found for id ( ${route.params.itemId} )`);

  const product = item.product;

  return (
    <SafeAreaView>
      <ScrollView>
        {/* image */}
        <RemoteImageBackground
          imageName={product.imageName}
          imageVersion={product.imageVersion}
          style={styles.image}
        >
          <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.goBack()}>
            <GoBackButtonSvg />
          </TouchableOpacity>
        </RemoteImageBackground>

        {/* title */}
        <Text style={[styles.titleText, { color: colorTheme.text.primary }]}>{product.name}</Text>

        {/* subtitle */}
        <View style={styles.subtitleContainer}>
          <Text style={[styles.subtitleText, { color: colorTheme.text.primary }]}>
            {product.subtitle} - {formatPrice(product.price)}
          </Text>
        </View>

        {/* description */}
        <Text style={[styles.descriptionText, { color: colorTheme.text.secondary }]}>
          {product.description}
        </Text>

        {/* option lists */}
        {product.optionLists.map((optionList) => (
          <Fragment key={optionList.id}>
            <HorizontalLine style={[styles.horizontalLine, { backgroundColor: colorTheme.text.secondary }]} />
            <OptionListCard optionList={optionList} selectedOptions={selectedOptions[optionList.id] ?? {}} />
          </Fragment>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  horizontalLine: {
    marginVertical: 24,
    width: "95%",
  },
  image: {
    aspectRatio: 1,
    width: "100%",
  },
  goBackButton: {
    position: "absolute",
    top: 20,
    left: 20,
    width: 38,
    height: 38,
  },
  titleText: {
    fontSize: 28,
    fontWeight: "800",
    marginHorizontal: 12,
    marginTop: 12,
  },
  subtitleContainer: {
    marginTop: -4,
    marginHorizontal: 8,
    alignItems: "center",
  },
  subtitleText: {
    fontSize: 20,
    fontWeight: "500",
  },
  descriptionText: {
    marginTop: 20,
    marginHorizontal: 12,
    fontSize: 13,
  },
});
