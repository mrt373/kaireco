import GoodsCard from "@/components/GoodsCard";
import { useAuth } from "@/lib/auth";
import { fetchActiveGoods } from "@/lib/goods";
import { Goods } from "@/types/goods";
import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { t } = useTranslation();
  const { session } = useAuth();
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");
  const [goods, setGoods] = useState<Goods[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (!session?.user) return;
      let isActive = true;
      setIsLoading(true);
      fetchActiveGoods(session.user.id)
        .then((data) => {
          if (isActive) setGoods(data);
        })
        .finally(() => {
          if (isActive) setIsLoading(false);
        });
      return () => {
        isActive = false;
      };
    }, [session?.user]),
  );

  const allTags = [
    t("home.tagAll"),
    ...Array.from(new Set(goods.flatMap((g) => g.tags))),
  ];
  const totalValue = goods.reduce((sum, g) => sum + g.price, 0);

  const filtered = useMemo<Goods[]>(() => {
    return goods.filter((g) => {
      const matchTag = selectedTag === "all" || g.tags.includes(selectedTag);
      const matchSearch = g.title.toLowerCase().includes(search.toLowerCase());
      return matchTag && matchSearch;
    });
  }, [goods, search, selectedTag]);

  if (isLoading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator color="#C9A84C" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background px-4 pt-4" edges={["top"]}>
      <Text className="text-text-primary text-center text-lg font-bold mb-4">
        Home
      </Text>
      <View className="bg-surface border border-border rounded-xl px-4 py-3 mb-3">
        <TextInput
          className="text-text-primary text-sm"
          placeholder={t("home.searchPlaceholder")}
          placeholderTextColor="#555555"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-grow-0 mb-4 shrink-0"
        contentContainerStyle={{ gap: 8 }}
      >
        {allTags.map((tag, index) => {
          const value = index === 0 ? "all" : tag;
          return (
            <Pressable
              key={value}
              className={`px-4 py-2 rounded-full border shrink-0 ${
                selectedTag === value
                  ? "bg-gold border-gold"
                  : "bg-surface border-border"
              }`}
              onPress={() => setSelectedTag(value)}
            >
              <Text
                className={`text-sm ${
                  selectedTag === value
                    ? "text-black font-bold"
                    : "text-text-secondary font-medium"
                }`}
              >
                {tag}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View className="bg-surface border border-border rounded-xl p-4 mb-5 items-center">
        <Text className="text-text-secondary text-xs uppercase tracking-widest mb-1">
          {t("home.totalPortfolioValue")}
        </Text>
        <Text className="text-text-primary text-3xl font-bold mb-2">
          ${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </Text>
        <View className="flex-row items-center gap-2">
          <Text className="text-text-secondary text-sm">
            {t("home.keep")}{" "}
            <Text className="text-gold font-semibold">
              {goods.filter((g) => g.status === "keep").length}
            </Text>
          </Text>
          <Text className="text-text-muted">•</Text>
          <Text className="text-text-secondary text-sm">
            {t("home.toSell")}
            <Text className="text-gold font-semibold">
              {goods.filter((g) => g.status === "to_sell").length}
            </Text>
          </Text>
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.goods_id}
        renderItem={({ item }) => <GoodsCard item={item} />}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text className="text-text-muted text-sm text-center mt-10">
            {t("common.noItems")}
          </Text>
        }
      />
    </SafeAreaView>
  );
}
