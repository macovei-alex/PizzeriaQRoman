import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { useGlobalContext } from "../../context/useGlobalContext";
import { useScrollRef } from "../../hooks/useScrollRef";
import { useQuery } from "react-query";
import api from "../../api";
import LogoSection from "../../components/menu/index/LogoSection";
import HorizontalCategorySection from "../../components/menu/index/HorizontalCategorySection";
import VerticalCategorySection from "../../components/menu/index/VerticalCategorySection";
import useDiskImages from "../../hooks/useDiskImages";

export default function Menu() {
  const [productsPerCategroy, setProductsPerCategory] = useState([{ category: { id: 1 }, products: [] }]);
  const { scrollRef, scrollToPos } = useScrollRef();
  const [categoryPositions, setCategoryPositions] = useState({});

  const productQuery = useQuery({
    queryKey: ["products"],
    queryFn: api.fetchProducts,
  });
  const categoryQuery = useQuery({
    queryKey: ["categories"],
    queryFn: api.fetchCategories,
  });
  const imagesQuery = useDiskImages(productQuery.data?.map((product) => product.imageName));

  // Save the position of each category for the scroll to position from the horizontal menu
  const updateCategoryLayoutPosition = (categoryId, event) => {
    // Extracting data in layout is a MUST because the event is a synthetic event (event pooling)
    // and event.nativeEvent will be set to null afterwards.
    const { layout } = event.nativeEvent;
    setCategoryPositions((prevPositions) => ({
      ...prevPositions,
      [categoryId]: layout.y,
    }));
  };

  const scrollToCategoryId = (categoryId) => {
    const pos = categoryPositions[categoryId];
    if (pos) {
      scrollToPos({ y: pos });
    }
  };

  // Split products by category
  useEffect(() => {
    if (
      productQuery.isLoading ||
      productQuery.isError ||
      !productQuery.data ||
      categoryQuery.isLoading ||
      categoryQuery.isError ||
      !categoryQuery.data
    )
      return;

    const productsSplit = [];
    for (let i = 0; i < categoryQuery.data.length; i++) {
      productsSplit.push({
        category: categoryQuery.data[i],
        products: [],
      });
      for (let j = 0; j < productQuery.data.length; j++) {
        if (productQuery.data[j].categoryId === categoryQuery.data[i].id) {
          productsSplit[i].products.push(productQuery.data[j]);
        }
      }
    }
    setProductsPerCategory(productsSplit);
  }, [productQuery.data, categoryQuery.data]);

  if (productQuery.isLoading || categoryQuery.isLoading || imagesQuery.isLoading) {
    return <Text>Loading...</Text>;
  }
  if (productQuery.isError) {
    return <Text>Error: {productQuery.error.message}</Text>;
  }
  if (categoryQuery.isError) {
    return <Text>Error: {categoryQuery.error.message}</Text>;
  }
  if (imagesQuery.isError) {
    return <Text>Error: {imagesQuery.error.message}</Text>;
  }

  return (
    <SafeAreaView>
      <ScrollView ref={scrollRef}>
        <LogoSection />

        <HorizontalCategorySection categories={categoryQuery.data} onCategoryPress={scrollToCategoryId} />

        <View>
          {productsPerCategroy.map(({ category, products }) => (
            <VerticalCategorySection
              key={category.id}
              category={category}
              products={products}
              productImages={imagesQuery.data}
              customOnLayout={updateCategoryLayoutPosition}
              onMenuProductClick={(product) => {
                router.push({
                  pathname: "/menu/product",
                  params: { productId: product.id, imageName: product.imageName },
                });
              }}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
