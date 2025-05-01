import React, { useCallback, useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LayoutChangeEvent, ScrollView, View } from "react-native";
import useScrollRef from "src/hooks/useScrollRef";
import LogoSection from "src/components/menu/MenuScreen/LogoSection";
import HorizontalCategorySection from "src/components/menu/MenuScreen/HorizontalCategorySection";
import VerticalCategorySection from "src/components/menu/MenuScreen/VerticalCategorySection";
import useProductsQuery from "src/api/hooks/useProductsQuery";
import useCategoriesQuery from "src/api/hooks/useCategoriesQuery";
import { Category, CategoryId } from "src/api/types/Category";
import { Product } from "src/api/types/Product";
import logger from "src/utils/logger";
import MenuSkeletonLoader from "src/components/menu/MenuScreen/MenuSkeletonLoader";
import useColorTheme from "src/hooks/useColorTheme";
import ErrorComponent from "../../components/shared/generic/ErrorComponent";
import { useImageContext } from "src/context/ImageContext";

type ProductSplit = {
  category: Category;
  products: Product[];
};

export default function MenuScreen() {
  logger.render("MenuScreen");

  const colorTheme = useColorTheme();
  const imageContext = useImageContext();
  const productsQuery = useProductsQuery();
  const categoryQuery = useCategoriesQuery();
  const { scrollRef, scrollToPos } = useScrollRef();
  const [categoryPositions, setCategoryPositions] = useState<Record<CategoryId, number>>({});

  // Save the position of each category for the scroll to position from the horizontal menu
  const updateCategoryLayoutPosition = useCallback((categoryId: CategoryId, event: LayoutChangeEvent) => {
    // Extracting data in layout is a MUST because the event is a synthetic event (event pooling)
    // and event.nativeEvent will be set to null afterwards.
    const { layout } = event.nativeEvent;
    setCategoryPositions((prev) => {
      return { ...prev, [categoryId]: layout.y };
    });
  }, []);

  const scrollToCategoryId = useCallback(
    (categoryId: CategoryId) => {
      const pos = categoryPositions[categoryId];
      if (pos) scrollToPos({ y: pos });
    },
    [categoryPositions, scrollToPos]
  );

  // Split products by category
  const productsPerCategory = useMemo(() => {
    if (!productsQuery.data || !categoryQuery.data) return [];

    const productsSplit: ProductSplit[] = [];
    for (const category of categoryQuery.data) {
      const newProductSplit: ProductSplit = { category: category, products: [] };
      for (const product of productsQuery.data) {
        if (product.categoryId === category.id) {
          newProductSplit.products.push(product);
        }
      }
      productsSplit.push(newProductSplit);
    }
    return productsSplit;
  }, [productsQuery.data, categoryQuery.data]);

  if (productsQuery.isLoading || categoryQuery.isLoading) return <MenuSkeletonLoader />;
  if (productsQuery.isError || categoryQuery.isError) {
    return (
      <ErrorComponent
        onRetry={() => {
          productsQuery.refetch();
          categoryQuery.refetch();
          imageContext.refetchImages();
        }}
      />
    );
  }

  return (
    <SafeAreaView style={{ backgroundColor: colorTheme.background.primary }}>
      <ScrollView ref={scrollRef}>
        <LogoSection />

        <HorizontalCategorySection categories={categoryQuery.data!} onCategoryPress={scrollToCategoryId} />

        <View>
          {productsPerCategory.map(({ category, products }) => (
            <VerticalCategorySection
              key={category.id}
              category={category}
              products={products}
              onLayout={updateCategoryLayoutPosition}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
