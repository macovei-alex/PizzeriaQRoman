import React, { useMemo, useRef } from "react";
import { LayoutChangeEvent, RefreshControl, ScrollView, View } from "react-native";
import LogoSection from "src/components/menu/MenuScreen/LogoSection";
import HorizontalCategorySection from "src/components/menu/MenuScreen/HorizontalCategorySection";
import VerticalCategorySection from "src/components/menu/MenuScreen/VerticalCategorySection";
import useProductsQuery from "src/api/queries/productsQuery";
import useCategoriesQuery from "src/api/queries/categoriesQuery";
import { Category, CategoryId } from "src/api/types/Category";
import { Product } from "src/api/types/Product";
import logger from "src/constants/logger";
import MenuSkeletonLoader from "src/components/menu/MenuScreen/MenuSkeletonLoader";
import ErrorComponent from "../../components/shared/generic/ErrorComponent";
import { useScrollOffsets } from "src/hooks/useScrollOffsets";
import { StyleSheet } from "react-native-unistyles";
import useRestaurantConstantsQuery from "src/api/queries/restaurantConstantsQuery";

type ProductSplit = {
  category: Category;
  products: Product[];
};

export default function MenuScreen() {
  logger.render("MenuScreen");

  const productsQuery = useProductsQuery();
  const categoryQuery = useCategoriesQuery();
  const restaurantConstantsQuery = useRestaurantConstantsQuery();
  const scrollRef = useRef<ScrollView>(null);
  const vertical = useScrollOffsets<CategoryId>();

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

  const scrollYRef = useRef<number>(0);

  if (productsQuery.isFetching || categoryQuery.isFetching) {
    return <MenuSkeletonLoader />;
  }
  if (productsQuery.isError || categoryQuery.isError || restaurantConstantsQuery.isError) {
    return <ErrorComponent />;
  }
  if (!categoryQuery.data) throw new Error("Categories not found");

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        ref={scrollRef}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => {
              productsQuery.refetch();
              categoryQuery.refetch();
              restaurantConstantsQuery.refetch();
            }}
          />
        }
        stickyHeaderIndices={[1]}
        onScroll={(event) => (scrollYRef.current = event.nativeEvent.contentOffset.y)}
        scrollEventThrottle={50}
        nestedScrollEnabled
      >
        <LogoSection minimumOrderValue={restaurantConstantsQuery.data?.minimumOrderValue} />

        <HorizontalCategorySection
          categories={categoryQuery.data}
          verticalOffsets={vertical.offsets}
          onCategoryPress={(categoryId: CategoryId) =>
            scrollRef.current?.scrollTo({ y: vertical.offsets.get(categoryId) })
          }
          scrollYRef={scrollYRef}
        />

        <>
          {productsPerCategory.map(({ category, products }) => (
            <VerticalCategorySection
              key={category.id}
              category={category}
              products={products}
              onLayout={(categoryId: CategoryId, event: LayoutChangeEvent) =>
                vertical.addOffset(categoryId, event.nativeEvent.layout.y - 120)
              }
            />
          ))}
        </>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create((theme, runtime) => ({
  screen: {
    backgroundColor: theme.background.primary,
    top: runtime.insets.top,
  },
  scrollViewContent: {
    paddingBottom: 28,
  },
}));
