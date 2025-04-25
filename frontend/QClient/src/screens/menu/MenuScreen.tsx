import React, { useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LayoutChangeEvent, ScrollView, Text, TouchableOpacity, View } from "react-native";
import useScrollRef from "src/hooks/useScrollRef";
import LogoSection from "src/components/menu/MenuScreen/LogoSection";
import HorizontalCategorySection from "src/components/menu/MenuScreen/HorizontalCategorySection";
import VerticalCategorySection from "src/components/menu/MenuScreen/VerticalCategorySection";
import useImages from "src/hooks/useImages";
import useProductsQuery from "src/api/hooks/useProductsQuery";
import useCategoriesQuery from "src/api/hooks/useCategoriesQuery";
import { Category, CategoryId } from "src/api/types/Category";
import { Product } from "src/api/types/Product";
import logger from "src/utils/logger";
import MenuSkeletonLoader from "src/components/menu/MenuScreen/MenuSkeletonLoader";
import useColorTheme from "src/hooks/useColorTheme";
import GoBackButtonSvg from "src/components/svg/GoBackButtonSvg";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MenuStackParamList } from "src/navigation/MenuStackNavigator";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

type ProductSplit = {
  category: Category;
  products: Product[];
};

type MenuScreenProps = { navigation: NativeStackNavigationProp<MenuStackParamList, "MenuScreen"> };

export default function MenuScreen({ navigation }: MenuScreenProps) {
  logger.render("MenuScreen");

  const colorTheme = useColorTheme();
  const { scrollRef, scrollToPos } = useScrollRef();
  const [categoryPositions, setCategoryPositions] = useState<Record<CategoryId, number>>({});

  const productQuery = useProductsQuery();
  const categoryQuery = useCategoriesQuery();

  const imageNames = useMemo(
    () => productQuery.data?.map((product) => product.imageName) || [],
    [productQuery.data]
  );
  const images = useImages(imageNames);

  // Save the position of each category for the scroll to position from the horizontal menu
  function updateCategoryLayoutPosition(categoryId: CategoryId, event: LayoutChangeEvent) {
    // Extracting data in layout is a MUST because the event is a synthetic event (event pooling)
    // and event.nativeEvent will be set to null afterwards.
    const { layout } = event.nativeEvent;
    setCategoryPositions((prevPositions) => {
      return { ...prevPositions, [categoryId]: layout.y };
    });
  }

  function scrollToCategoryId(categoryId: CategoryId) {
    const pos = categoryPositions[categoryId];
    if (pos) {
      scrollToPos({ y: pos });
    }
  }

  // Split products by category
  const productsPerCategory = useMemo(() => {
    if (!productQuery.data || !categoryQuery.data) {
      return [];
    }

    const productsSplit: ProductSplit[] = [];
    for (const category of categoryQuery.data) {
      const newProductSplit: ProductSplit = { category: category, products: [] };
      for (const product of productQuery.data) {
        if (product.categoryId === category.id) {
          newProductSplit.products.push(product);
        }
      }
      productsSplit.push(newProductSplit);
    }
    return productsSplit;
  }, [productQuery.data, categoryQuery.data]);

  if (productQuery.isLoading || categoryQuery.isLoading || !images || images.length === 0) {
    return <MenuSkeletonLoader />;
  }
  if (productQuery.isError) {
    return <Text>Error: {productQuery.error.message}</Text>;
  }
  if (categoryQuery.isError) {
    return <Text>Error: {categoryQuery.error.message}</Text>;
  }

  return (
    <SafeAreaView style={{ backgroundColor: colorTheme.background.primary }}>
      <ScrollView ref={scrollRef}>
        <LogoSection />

        {/* For testing purposes */}
        <TouchableOpacity
          style={{ position: "absolute", top: 20, left: 20, width: 38, height: 38 }}
          onPress={() => navigation.navigate("SkeletonLoaderTestScreen")}
        >
          <GoBackButtonSvg />
        </TouchableOpacity>

        <HorizontalCategorySection
          categories={categoryQuery.data as Category[]}
          onCategoryPress={scrollToCategoryId}
        />

        <View>
          {productsPerCategory.map(({ category, products }) => (
            <VerticalCategorySection
              key={category.id}
              navigation={navigation}
              category={category}
              products={products}
              productImages={images}
              onLayout={updateCategoryLayoutPosition}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
