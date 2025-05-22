import React, { useCallback, useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LayoutChangeEvent, ScrollView } from "react-native";
import useScrollRef from "src/hooks/useScrollRef";
import LogoSection from "src/components/menu/MenuScreen/LogoSection";
import HorizontalCategorySection from "src/components/menu/MenuScreen/HorizontalCategorySection";
import VerticalCategorySection from "src/components/menu/MenuScreen/VerticalCategorySection";
import useProductsQuery from "src/api/hooks/queries/useProductsQuery";
import useCategoriesQuery from "src/api/hooks/queries/useCategoriesQuery";
import { Category, CategoryId } from "src/api/types/Category";
import { Product } from "src/api/types/Product";
import logger from "src/utils/logger";
import MenuSkeletonLoader from "src/components/menu/MenuScreen/MenuSkeletonLoader";
import useColorTheme from "src/hooks/useColorTheme";
import ErrorComponent from "../../components/shared/generic/ErrorComponent";
import { useScrollOffsets } from "src/hooks/useScrollOffsets";

type ProductSplit = {
  category: Category;
  products: Product[];
};

export default function MenuScreen() {
  logger.render("MenuScreen");

  const colorTheme = useColorTheme();
  const productsQuery = useProductsQuery();
  const categoryQuery = useCategoriesQuery();
  const { scrollRef, scrollToPos } = useScrollRef();
  const vertical = useScrollOffsets<CategoryId>();

  // Save the position of each category for the scroll to position from the horizontal menu
  const updateVerticalOffsets = useCallback(
    (categoryId: CategoryId, event: LayoutChangeEvent) =>
      vertical.addOffset(categoryId, event.nativeEvent.layout.y - 120),
    [vertical]
  );

  const scrollVertically = useCallback(
    (categoryId: CategoryId) => scrollToPos({ y: vertical.offsets[categoryId] }),
    [vertical.offsets, scrollToPos]
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

  const [scrollY, setScrollY] = useState(0);

  if (productsQuery.isFetching || categoryQuery.isFetching) return <MenuSkeletonLoader />;
  if (productsQuery.isError || categoryQuery.isError) return <ErrorComponent />;
  if (!categoryQuery.data) throw new Error("Categories not found");

  return (
    <SafeAreaView style={{ backgroundColor: colorTheme.background.primary }}>
      <ScrollView
        ref={scrollRef}
        stickyHeaderIndices={[1]}
        onScroll={(event) => setScrollY(event.nativeEvent.contentOffset.y)}
        nestedScrollEnabled
      >
        <LogoSection />

        <HorizontalCategorySection
          categories={categoryQuery.data}
          verticalOffsets={vertical.offsets}
          onCategoryPress={scrollVertically}
          scrollY={scrollY}
        />

        <>
          {productsPerCategory.map(({ category, products }) => (
            <VerticalCategorySection
              key={category.id}
              category={category}
              products={products}
              onLayout={updateVerticalOffsets}
            />
          ))}
        </>
      </ScrollView>
    </SafeAreaView>
  );
}
