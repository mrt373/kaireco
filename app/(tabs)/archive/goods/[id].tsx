import MenuModal from "@/components/MenuModal";
import { fetchGoodsById } from "@/lib/goods";
import { supabase } from "@/lib/supabase";
import { Goods } from "@/types/goods";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
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

  useFocusEffect(
    useCallback(() => {
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
    }, [id]),
  );

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
  const isArchiveFormOpen = item.archived_at != null;

  const handleMoreOptions = () => {
    setIsOpen(!isOpen);

    try {
      console.log("More options pressed");
    } catch (error) {
      console.error(error);
    }
  };

  const backToGoodsList = async () => {
    try {
      const { error: EditError } = await supabase
        .from("goods")
        .update({
          archived_at: null,
          status: "keep",
        })
        .eq("goods_id", id)
        .select("goods_id");

      if (EditError) throw EditError;
      router.replace("/archive");
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = () => {
    Alert.alert(t("menu.deleteConfirmTitle"), t("menu.deleteConfirmMessage"), [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: async () => {
          const { error } = await supabase
            .from("goods")
            .delete()
            .eq("goods_id", id);
          if (error) throw error;
          router.back();
        },
      },
    ]);
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
          </View>

          <View className="flex-row flex-wrap gap-2 mb-4 py-2">
            {item.tags.map((tag) => (
              <View
                key={tag}
                className="bg-surface border border-border px-3 rounded-full"
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

          {isArchiveFormOpen && (
            <>
              <Pressable
                onPress={backToGoodsList}
                className="bg-gold rounded-xl py-4 items-center mb-3 active:opacity-80"
              >
                <Text className="text-background text-sm font-bold text-center">
                  持ち物一覧に戻す
                </Text>
              </Pressable>
              <TouchableOpacity
                onPress={handleDelete}
                className=" bg-surface   rounded-xl py-4 items-center mb-3 active:opacity-80 border border-error"
              >
                <Text className="text-error ">削除する</Text>
              </TouchableOpacity>
            </>
          )}
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
