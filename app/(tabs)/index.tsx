import GoodsCard from "@/components/GoodsCard";
import { MOCK_GOODS } from "@/constants/mockData";
import { Goods } from "@/types/goods";
import { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

const ALL_TAGS = [
  "All",
  ...Array.from(new Set(MOCK_GOODS.flatMap((g) => g.tags))),
];

export default function HomeScreen() {
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");

  const totalValue = MOCK_GOODS.reduce((sum, g) => sum + g.price, 0);

  const filtered = useMemo<Goods[]>(() => {
    return MOCK_GOODS.filter((g) => {
      const matchTag = selectedTag === "All" || g.tags.includes(selectedTag);
      const matchSearch = g.title.toLowerCase().includes(search.toLowerCase());
      return matchTag && matchSearch;
    });
  }, [search, selectedTag]);

  return (
    <View className="flex-1 bg-background px-4 pt-4">
      {/* 検索バー */}
      <View className="bg-surface border border-border rounded-xl px-4 py-3 mb-3">
        <TextInput
          className="text-text-primary text-sm"
          placeholder="Search your high-value items..."
          placeholderTextColor="#555555"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* タグフィルター */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-grow-0 mb-4 shrink-0"
        contentContainerStyle={{ gap: 8 }}
      >
        {ALL_TAGS.map((tag) => (
          <Pressable
            key={tag}
            className={`px-4 py-2 rounded-full border shrink-0 ${
              selectedTag === tag
                ? "bg-gold border-gold"
                : "bg-surface border-border"
            }`}
            onPress={() => setSelectedTag(tag)}
          >
            <Text
              className={`text-sm ${
                selectedTag === tag
                  ? "text-black font-bold"
                  : "text-text-secondary font-medium"
              }`}
            >
              {tag}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* ポートフォリオ合計 */}
      <View className="bg-surface border border-border rounded-xl p-4 mb-5 items-center">
        <Text className="text-text-secondary text-xs uppercase tracking-widest mb-1">
          Total Portfolio Value
        </Text>
        <Text className="text-text-primary text-3xl font-bold mb-2">
          ${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </Text>
        <View className="flex-row items-center gap-2">
          <Text className="text-text-secondary text-sm">
            Keep{" "}
            <Text className="text-gold font-semibold">
              {MOCK_GOODS.filter((g) => g.status === "keep").length}
            </Text>
          </Text>
          <Text className="text-text-muted">•</Text>
          <Text className="text-text-secondary text-sm">
            To Sell{" "}
            <Text className="text-gold font-semibold">
              {MOCK_GOODS.filter((g) => g.status === "to_sell").length}
            </Text>
          </Text>
        </View>
      </View>

      {/* 持ち物リスト */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.goods_id}
        renderItem={({ item }) => <GoodsCard item={item} />}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
