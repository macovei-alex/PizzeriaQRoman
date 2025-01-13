import { Image, StyleSheet, Text, View } from "react-native";
import { imageOrDefault } from "../../utils/files";
import useSingleImage from "../../hooks/useSingleImage";

export default function CartItem({ cartItem }) {
  const image = useSingleImage(cartItem.product.imageName);

  return (
    <View style={styles.container}>
      <View style={styles.infoSectionContainer}>
        <Image source={imageOrDefault(image)} style={styles.image} />
        <View style={styles.textSectionContainer}>
          <Text style={styles.productNameText}>{cartItem.product.name}</Text>
          <Text style={styles.productSubtitleText}>{cartItem.product.subtitle}</Text>
          <Text style={styles.productDescriptionText}>{cartItem.product.description}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    marginVertical: 12,
  },
  infoSectionContainer: {
    flexDirection: "row",
    gap: 16,
  },
  image: {
    width: "35%",
    aspectRatio: 1,
    borderRadius: 9999,
  },
  textSectionContainer: {},
  productNameText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  productSubtitleText: {
    fontSize: 16,
  },
  productDescriptionText: {
    fontSize: 14,
  },
});
