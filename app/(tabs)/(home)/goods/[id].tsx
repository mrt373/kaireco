import { MOCK_GOODS } from "@/constants/mockData";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function GoodsDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const item = MOCK_GOODS.find((g) => g.goods_id === id);

  if (!item) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Text className="text-text-secondary">Item not found.</Text>
      </View>
    );
  }

  const isToSell = item.status === "to_sell";

  return (
    <View className="flex-1 bg-background">
      {/* ヘッダー */}
      <View className="flex-row justify-between items-center px-4 pt-4 pb-2">
        <TouchableOpacity
          onPress={() => router.dismiss()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          className="p-2"
        >
          <MaterialIcons name="arrow-back" size={24} color="#F5F0E8" />
        </TouchableOpacity>
        <TouchableOpacity
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          className="p-2"
        >
          <MaterialIcons name="more-vert" size={24} color="#F5F0E8" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 画像 */}
        <View className="mx-4 rounded-xl overflow-hidden mb-5">
          <Image
            source={{ uri: item.images[0] }}
            className="w-full h-56"
            resizeMode="cover"
          />
        </View>

        <View className="px-4">
          {/* タイトル・バッジ */}
          <View className="flex-row justify-between items-start mb-2">
            <Text className="text-text-primary text-2xl font-bold flex-1 mr-3">
              {item.title}
            </Text>
            <View
              className={`px-3 py-1 rounded mt-1 ${
                isToSell
                  ? "bg-surface-elevated border border-border"
                  : "bg-gold-muted"
              }`}
            >
              <Text
                className={`text-xs font-bold tracking-widest ${
                  isToSell ? "text-text-secondary" : "text-gold"
                }`}
              >
                {isToSell ? "TO SELL" : "KEEP"}
              </Text>
            </View>
          </View>

          {/* タグ */}
          <View className="flex-row flex-wrap gap-2 mb-4">
            {item.tags.map((tag) => (
              <View
                key={tag}
                className="bg-surface border border-border px-3 py-1 rounded-full"
              >
                <Text className="text-text-secondary text-xs">{tag}</Text>
              </View>
            ))}
          </View>

          {/* 購入価格 */}
          <View className="bg-surface border border-border rounded-xl p-4 mb-4">
            <Text className="text-text-secondary text-xs uppercase tracking-widest mb-1">
              Acquisition Value
            </Text>
            <Text className="text-gold text-2xl font-bold">
              ${item.price.toLocaleString()}
            </Text>
          </View>

          {/* メモ */}
          <View className="bg-surface border border-border rounded-xl p-4 mb-4">
            <Text className="text-text-secondary text-xs uppercase tracking-widest mb-2">
              Note
            </Text>
            <Text className="text-text-primary text-sm leading-relaxed">
              {item.text}
            </Text>
          </View>

          {/* 購入日 */}
          <View className="bg-surface border border-border rounded-xl p-4 mb-8">
            <Text className="text-text-secondary text-xs uppercase tracking-widest mb-1">
              Acquired
            </Text>
            <Text className="text-text-primary text-sm">{item.created_at}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
