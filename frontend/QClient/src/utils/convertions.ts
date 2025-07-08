import { ColorValue } from "react-native";
import { PlacedOrderOptionList } from "src/api/types/order/PlacedOrder";
import { CartItemOptions } from "src/context/CartContext/types";

export function convertCartItemOptions(cartItemOptions: CartItemOptions): PlacedOrderOptionList[] {
  return Object.entries(cartItemOptions).map(([optionListId, optionList]) => ({
    optionListId: Number(optionListId),
    options: Object.entries(optionList).map(([optionId, optionCount]) => ({
      optionId: Number(optionId),
      count: optionCount,
    })),
  }));
}

type RGBA = {
  r: number;
  g: number;
  b: number;
  a: number;
};

export function convertToRGBA(color: ColorValue): RGBA | null {
  if (typeof color === "string") {
    const hexMatch = color.match(/^#([a-fA-F0-9]{3,8})$/);
    if (hexMatch) {
      let hex = hexMatch[1];
      if (hex.length === 3) {
        hex = hex
          .split("")
          .map((c) => c + c)
          .join("");
      }
      if (hex.length === 6) hex += "FF";
      const intVal = parseInt(hex, 16);
      const r = (intVal >> 24) & 255;
      const g = (intVal >> 16) & 255;
      const b = (intVal >> 8) & 255;
      const a = (intVal & 255) / 255;
      return { r, g, b, a };
    }
  }

  return null;
}

export function tokenize(input: string | string[]): string[] {
  const inputString = typeof input === "string" ? input : input.join(" ");
  const tokens = inputString
    .normalize("NFD")
    .toLowerCase()
    .replace("-", " ")
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter(Boolean);
  return tokens;
}
