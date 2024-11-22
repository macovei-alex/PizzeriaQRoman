import { View, StyleSheet, Platform, ScrollView, Text } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import GoBackButtonSVG from "../../components/svg/GoBackButtonSVG";
import { useQuery } from "react-query";

export default function TestComponent() {
  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["test", { data }],
    queryFn: async () => {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts"
      );
      return response.json();
    },
  });

  console.log({ data: data ? true : false, isError, error, isLoading });

  if (isLoading) return <Text>Loading...</Text>;
  if (isError) return <Text>Error: {error.message}</Text>;

  return (
    <SafeAreaView>
      <Text>{data[0].body}</Text>
    </SafeAreaView>
  );
}
