import { View, StyleSheet, Platform, ScrollView, Text } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import GoBackButtonSVG from "../../components/svg/GoBackButtonSVG";
import { useQuery } from "react-query";
import api from "../../api";

export default function TestComponent() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["categories"],
    queryFn: api.fetchCategoriesMock,
  });

  console.log({ data: data ? true : false, isError, error, isLoading });

  if (isLoading) return <Text>Loading...</Text>;
  if (isError) return <Text>Error: {error.message}</Text>;

  return (
    <SafeAreaView>
      <Text>{data ? JSON.stringify(data) : ""}</Text>
    </SafeAreaView>
  );
}
