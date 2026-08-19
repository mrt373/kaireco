import ArchiveCard from "@/components/ArchiveCard";
import { MOCK_ARCHIVED } from "@/constants/mockData";
import { ArchiveMethod } from "@/types/goods";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ArchiveScreen() {
  const { t } = useTranslation();
  const [selectedMethod, setSelectedMethod] = useState<ArchiveMethod | "all">(
    "all",
  );

  const METHOD_FILTERS: { label: string; value: ArchiveMethod | "all" }[] = [
    { label: t("archive.filterAll"), value: "all" },
    { label: t("archive.filterDonated"), value: "donated" },
    { label: t("archive.filterSold"), value: "sold" },
    { label: t("archive.filterRecycled"), value: "recycled" },
    { label: t("archive.other"), value: "other" },
  ];

  export const ARCHIVE_METHODS = [
    "donated",
    "sold",
    "recycled",
    "other",
  ] as const;

  const filtered = useMemo(() => {
    if (selectedMethod === "all") return MOCK_ARCHIVED;
    return MOCK_ARCHIVED.filter((g) => g.archive_method === selectedMethod);
  }, [selectedMethod]);

  return (
    <SafeAreaView className="flex-1 bg-background px-4 pt-4">
      <View className="items-center px-4 pt-4 pb-2 ">
        <Text className="text-text-primary text-lg font-bold ml-2">
          {t("archive.title")}
        </Text>
      </View>

      <View className="bg-surface border border-border rounded-xl p-4 mb-5">
        <Text className="text-text-secondary text-xs uppercase tracking-widest mb-3">
          {t("archive.totalRemoved")}
        </Text>
        <Text className="text-text-primary text-4xl font-bold mb-1">
          {MOCK_ARCHIVED.length}
        </Text>
        <Text className="text-text-muted text-xs mb-4">
          {t("archive.transformations")}
        </Text>
        <View className="flex-row gap-4">
          {METHOD_FILTERS.slice(1).map((m) => {
            const count = MOCK_ARCHIVED.filter(
              (g) => g.archive_method === m.value,
            ).length;
            return (
              <View key={m.value} className="items-center">
                <Text className="text-text-primary text-lg font-semibold">
                  {count}
                </Text>
                <Text className="text-text-muted text-xs">{m.label}</Text>
              </View>
            );
          })}
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-grow-0 shrink-0 mb-4"
        contentContainerStyle={{ gap: 8 }}
      >
        {METHOD_FILTERS.map((m) => (
          <Pressable
            key={m.value}
            className={`px-4 py-2 rounded-full border shrink-0 ${
              selectedMethod === m.value
                ? "bg-gold border-gold"
                : "bg-surface border-border"
            }`}
            onPress={() => setSelectedMethod(m.value)}
          >
            <Text
              className={`text-sm ${
                selectedMethod === m.value
                  ? "text-black font-bold"
                  : "text-text-secondary font-medium"
              }`}
            >
              {m.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.goods_id}
        renderItem={({ item }) => <ArchiveCard item={item} />}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="items-center mt-16">
            <Text className="text-text-muted text-sm">
              {t("common.noItems")}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
