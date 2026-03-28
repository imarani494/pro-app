import { Dimensions } from "react-native";

const { height: screenHeight, width: screenWidth } = Dimensions.get("screen");

type Screen = "width" | "height";
export const screen: Record<Screen, number> = {
  width: screenWidth,
  height: screenHeight,
};

type layout =
  | "x1"
  | "x2"
  | "x3"
  | "x4"
  | "x5"
  | "x10"
  | "x15"
  | "x16"
  | "x20"
  | "x25"
  | "x30"
  | "x35";

export const layout: Record<layout, number> = {
  x1: 1,
  x2: 2,
  x3: 3,
  x4: 4,
  x5: 5,
  x10: 10,
  x15: 15,
  x16: 16,
  x20: 20,
  x25: 25,
  x30: 30,
  x35: 35,
};

export const x1 = layout.x1;
export const x2 = layout.x2;
export const x3 = layout.x3;
export const x4 = layout.x4;
export const x5 = layout.x5;
export const x10 = layout.x10;
export const x15 = layout.x15;
export const x16 = layout.x16;
export const x20 = layout.x20;
export const x25 = layout.x25;
export const x30 = layout.x30;
export const x35 = layout.x35;

type Icons = "x10" | "x15" | "x20" | "x25" | "x30" | "x40";
export const icons: Record<Icons, number> = {
  x10: 14,
  x15: 17,
  x20: 20,
  x25: 25,
  x30: 30,
  x40: 40,
};
