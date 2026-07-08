import { Goods } from "@/types/goods";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Image, Pressable, Text, View } from "react-native";

type Props = { item: Goods };

export default function GoodsCard({ item }: Props) {
  const { t } = useTranslation();
  const isToSell = item.status === "to_sell";
  const router = useRouter();

  return (
    <Pressable
      className="bg-surface border border-border rounded-xl mb-4 overflow-hidden active:opacity-70"
      onPress={() => router.push(`/goods/${item.goods_id}`)}
    >
      <Image source={{ uri: item.images[0] }} className="w-full h-44" resizeMode="cover" />
      <View className="p-4">
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-text-secondary text-xs uppercase tracking-widest">
            {item.tags[0]}
          </Text>
          <View
            className={
              isToSell
                ? "bg-surface-elevated border border-border px-3 py-1 rounded"
                : "bg-gold-muted px-3 py-1 rounded"
            }
          >
            <Text
              className={
                isToSell
                  ? "text-text-secondary text-xs font-bold tracking-widest"
                  : "text-gold text-xs font-bold tracking-widest"
              }
            >
              {isToSell ? t("goodsCard.toSell") : t("goodsCard.keep")}
            </Text>
          </View>
        </View>
        <Text className="text-text-primary text-lg font-semibold mt-1 mb-1">{item.title}</Text>
        <Text className="text-gold text-sm font-medium">${item.price.toLocaleString()}</Text>
      </View>
    </Pressable>
  );
}
