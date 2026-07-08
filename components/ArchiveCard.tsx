import { ArchiveMethod, Goods } from "@/types/goods";
import { useTranslation } from "react-i18next";
import { Image, Text, View } from "react-native";

type Props = { item: Goods };

const METHOD_STYLE: Record<ArchiveMethod, string> = {
  donated: "bg-blue-900 border-blue-700",
  sold: "bg-green-900 border-green-700",
  recycled: "bg-stone-700 border-stone-500",
  other: "bg-surface-elevated border-border",
};

const METHOD_TEXT_STYLE: Record<ArchiveMethod, string> = {
  donated: "text-blue-300",
  sold: "text-green-300",
  recycled: "text-stone-300",
  other: "text-text-secondary",
};

export default function ArchiveCard({ item }: Props) {
  const { t } = useTranslation();
  const method = item.archive_method ?? "other";

  const methodLabel: Record<ArchiveMethod, string> = {
    donated: t("archive.donated"),
    sold: t("archive.sold"),
    recycled: t("archive.recycled"),
    other: t("archive.other"),
  };

  return (
    <View className="bg-surface border border-border rounded-xl mb-4 overflow-hidden">
      <Image source={{ uri: item.images[0] }} className="w-full h-40" resizeMode="cover" />
      <View className="absolute top-0 left-0 right-0 h-40 bg-black/40" />
      <View className="p-4">
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-text-muted text-xs uppercase tracking-widest">
            {item.archived_at}
          </Text>
          <View className={`px-3 py-1 rounded border ${METHOD_STYLE[method]}`}>
            <Text className={`text-xs font-bold tracking-widest ${METHOD_TEXT_STYLE[method]}`}>
              {methodLabel[method]}
            </Text>
          </View>
        </View>
        <Text className="text-text-primary text-base font-semibold mt-1 mb-1">{item.title}</Text>
        {item.archive_reason && (
          <Text className="text-text-secondary text-xs mb-2" numberOfLines={2}>
            {item.archive_reason}
          </Text>
        )}
        {item.price > 0 && (
          <Text className="text-text-muted text-sm">
            {t("archive.value")}{" "}
            <Text className="text-text-secondary font-medium">${item.price.toLocaleString()}</Text>
          </Text>
        )}
      </View>
    </View>
  );
}
