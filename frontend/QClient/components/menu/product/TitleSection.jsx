import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import GoBackButtonSVG from "../../svg/GoBackButtonSVG";
import { images } from "../../../constants";
import { useColorTheme } from "../../../hooks/useColorTheme";
import { useRouter } from "expo-router";
import { imageOrDefault } from "../../../utils/files";

/**
 * @param {Object} props
 * @param {Object} props.product
 * @param {{ name: string, data: string }} props.productImage
 */
export default function TitleSection({ product, productImage }) {
  const colorTheme = useColorTheme();
  const router = useRouter();

  return (
    <>
      <ImageBackground source={imageOrDefault(productImage)} style={styles.image}>
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
