import GoodsCard from "@/components/GoodsCard";
import { useAuth } from "@/lib/auth";
import { getCurrentCurrency } from "@/lib/exchange";
import { fetchActiveGoods, fetchUserProfile } from "@/lib/goods";
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
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currencyRates, setCurrencyRates] = useState<Record<string, number>>(
    {},
  );
  const locale = selectedCurrency === "JPY" ? "ja-JP" : "en-US";
  useFocusEffect(
    useCallback(() => {
      if (!session?.user) return;
      let isActive = true;
      setIsLoading(true);
      Promise.all([
        fetchActiveGoods(session.user.id),
        fetchUserProfile(session.user.id),
      ])
        .then(([goodsData, profileData]) => {
          if (isActive) setGoods(goodsData);
          if (isActive)
            setSelectedCurrency(profileData?.display_currency ?? "USD");
          const currencies = Array.from(
            new Set([
              ...goodsData.map((g) => g.currency),
              profileData?.display_currency ?? "USD",
            ]),
          ).filter((c) => c !== "USD");
          console.log(currencies, +"出力確認");
          if (currencies.length > 0) {
            getCurrentCurrency("USD", currencies).then((rates) => {
              if (isActive) setCurrencyRates(rates);
            });
          }
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

  const filtered = useMemo<Goods[]>(() => {
    return goods.filter((g) => {
      const matchTag = selectedTag === "all" || g.tags.includes(selectedTag);
      const matchSearch = g.title.toLowerCase().includes(search.toLowerCase());
      return matchTag && matchSearch;
    });
  }, [goods, search, selectedTag]);

  // 通貨ごとの合計金額を計算
  const totalByCountry = goods.reduce(
    (totalAmount, goods) => {
      totalAmount[goods.currency] =
        (totalAmount[goods.currency] ?? 0) + goods.price;
      return totalAmount;
    },
    {} as Record<string, number>,
  );

  const convertedTotal = Object.entries(totalByCountry).reduce(
    (sum, [currency, amount]) => {
      const rate = currencyRates[currency] ?? 1;
      //JPY157.96
      if (selectedCurrency === "JPY") {
        const usdAmount = amount / rate;
        return sum + usdAmount * (currencyRates[selectedCurrency] ?? 1);
      } else if (selectedCurrency === "USD") {
        return sum + amount / rate;
      }
      return sum + amount;
    },
    0,
  );
  // reduceの外で処理する
  const displayTotal =
    selectedCurrency === "JPY" ? Math.round(convertedTotal) : convertedTotal;

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
          {selectedCurrency === "JPY" ? "¥" : "$"}
          {displayTotal.toLocaleString(locale, {
            minimumFractionDigits: { JPY: 0, USD: 2 }[selectedCurrency],
            maximumFractionDigits: { JPY: 0, USD: 2 }[selectedCurrency],
          })}
        </Text>

        <View className="flex-row gap-4">
          <View className="flex-row">
            <Text className="text-text-primary text-md mb-2">内訳：</Text>
          </View>
          <Text className="text-text-primary text-md mb-2">
            {"¥" +
              (totalByCountry.JPY ?? 0).toLocaleString("ja-JP", {
                minimumFractionDigits: 0,
              })}
          </Text>
          <Text className="text-text-primary text-md mb-2">/</Text>
          <Text className="text-text-primary text-md mb-2">
            {"$" +
              (totalByCountry.USD ?? 0).toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
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
