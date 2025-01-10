import { View, StyleSheet, Platform, ScrollView, Text, Image } from "react-native";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import GoBackButtonSVG from "../../components/svg/GoBackButtonSVG";
import { useQuery } from "react-query";
import api from "../../api";
import HomeIconSvg from "../../components/svg/HomeIconSvg";

export default function TestComponent() {
  const imagesQuery = useQuery({
    queryFn: api.fetchImages,
    queryKey: "images",
  });

  if (imagesQuery.isLoading) {
    return <Text>Loading...</Text>;
  }

  if (imagesQuery.isError) {
    return <Text>Error: {imagesQuery.error.message}</Text>;
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>
          {imagesQuery.data.map((image, index) => (
            <Fragment key={index}>
              <Text>{image.name}</Text>
              <Image source={{ uri: image.data }} style={styles.image} />
            </Fragment>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {},
  image: {
    width: 200,
    height: 200,
  },
});
