import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GoodsEditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center px-4 pt-4 pb-2">
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          className="p-2 -ml-2"
        >
          <MaterialIcons name="arrow-back" size={24} color="#F5F0E8" />
        </TouchableOpacity>
        <Text className="text-text-primary text-lg font-bold ml-2">
          商品編集
        </Text>
      </View>
      <Text className="text-text-primary">編集画面</Text>
      <Text className="text-text-primary">商品ID: {id}</Text>
    </SafeAreaView>
  );
}
