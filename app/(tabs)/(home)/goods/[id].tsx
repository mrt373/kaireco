import MenuModal from "@/components/MenuModal";
import { fetchGoodsById } from "@/lib/goods";
import { Goods } from "@/types/goods";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GoodsDetailScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [item, setItem] = useState<Goods | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let isActive = true;
    fetchGoodsById(id)
      .then((data) => {
        if (isActive) setItem(data);
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });
    return () => {
      isActive = false;
    };
  }, [id]);

  if (isLoading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator color="#C9A84C" />
      </View>
    );
  }

  if (!item) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Text className="text-text-secondary">{t("common.itemNotFound")}</Text>
      </View>
    );
  }

  const isToSell = item.status === "to_sell";

  const handleMoreOptions = () => {
    setIsOpen(!isOpen);

    try {
      console.log("More options pressed");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row justify-between items-center px-4 pt-4 pb-2">
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          className="p-2"
        >
          <MaterialIcons name="arrow-back" size={24} color="#F5F0E8" />
        </TouchableOpacity>
        <Text className="text-text-primary text-lg font-bold ml-2">
          {"アイテム"}
        </Text>
        <TouchableOpacity
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          className="p-2"
        >
          <MaterialIcons
            name="more-vert"
            size={24}
            color="#F5F0E8"
            onPress={handleMoreOptions}
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="mx-4 rounded-xl overflow-hidden mb-5">
          <Image
            source={{ uri: item.images[0] }}
            className="w-full h-56"
            resizeMode="cover"
          />
        </View>
        <View className="px-4">
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
                {isToSell ? t("goodsCard.toSell") : t("goodsCard.keep")}
              </Text>
            </View>
          </View>

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

          <View className="bg-surface border border-border rounded-xl p-4 mb-4">
            <Text className="text-text-secondary text-xs uppercase tracking-widest mb-1">
              {t("detail.acquisitionValue")}
            </Text>
            <Text className="text-gold text-2xl font-bold">
              ${item.price.toLocaleString()}
            </Text>
          </View>

          <View className="bg-surface border border-border rounded-xl p-4 mb-4">
            <Text className="text-text-secondary text-xs uppercase tracking-widest mb-2">
              {t("detail.note")}
            </Text>
            <Text className="text-text-primary text-sm leading-relaxed">
              {item.text}
            </Text>
          </View>

          <View className="bg-surface border border-border rounded-xl p-4 mb-8">
            <Text className="text-text-secondary text-xs uppercase tracking-widest mb-1">
              {t("detail.acquired")}
            </Text>
            <Text className="text-text-primary text-sm">{item.created_at}</Text>
          </View>
        </View>
      </ScrollView>
      {isOpen && (
        <MenuModal
          item={item.goods_id}
          isOpen={isOpen}
          isClosing={() => setIsOpen(!isOpen)}
        />
      )}
    </SafeAreaView>
  );
}
