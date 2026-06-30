import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

export default function GoodsEditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View className="flex-1 bg-background items-center justify-center ">
      <Text className="text-text-primary">編集画面</Text>
      <Text className="text-text-primary">商品ID: {id}</Text>
    </View>
  );
}
