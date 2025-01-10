import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import GoBackButtonSVG from "../../svg/GoBackButtonSVG";
import { images } from "../../../constants";
import { useColorTheme } from "../../../hooks/useColorTheme";
import { useRouter } from "expo-router";

export default function TitleSection({ product }) {
  const colorTheme = useColorTheme();
  const router = useRouter();

  return (
    <>
      {/* TODO: Uncomment this after implementing image caching */}
      <ImageBackground source={/* product.image ?? */ images.pizzaDemo} style={styles.image}>
        <TouchableOpacity onPress={() => router.back()}>
          <GoBackButtonSVG style={styles.goBackSvg} />
        </TouchableOpacity>
      </ImageBackground>
      <Text style={styles.titleText}>{product.name}</Text>
      <View style={styles.subtitleContainer}>
        <Text style={styles.subtitleText}>
          {product.subtitle} - {product.price.toFixed(2)} lei
        </Text>
      </View>
      <Text style={[styles.descriptionText, { color: colorTheme.text[200] }]}>{product.description}</Text>
    </>
  );
}

const styles = StyleSheet.create({
  image: {
    aspectRatio: 1,
    width: "100%",
  },
  goBackSvg: {
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
    width: "100%",
    alignItems: "center",
  },
  subtitleText: {
    fontSize: 20,
  },
  descriptionText: {
    marginTop: 20,
    marginHorizontal: 12,
    fontSize: 13,
  },
});
