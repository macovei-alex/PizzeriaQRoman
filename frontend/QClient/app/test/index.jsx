import { View, StyleSheet, Platform, ScrollView, Text } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import GoBackButtonSVG from "../../components/svg/GoBackButtonSVG";
import { useQuery } from "react-query";
import api from "../../api";
import HomeIconSvg from "../../components/svg/HomeIconSvg";

export default function TestComponent() {
  return <HomeIconSvg style={{ width: 32, height: 32 }}></HomeIconSvg>;
}
