import { ARCHIVE_METHODS } from "@/components/ArchiveMenuModal";
import { fetchGoodsById } from "@/lib/goods";
import useTags from "@/lib/hooks/useTags";
import { supabase } from "@/lib/supabase";
import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GoodsEditScreen() {
  const { t } = useTranslation();
  const [editTitle, setEditTitle] = useState("");
  const [editValue, setEditValue] = useState("");
  const [editText, setEditText] = useState("");
  const [editImage, setEditImage] = useState<string | null>(null);
  const [archiveReason, setArchiveReason] = useState("");
  const [currentMethod, setCurrentMethod] = useState("");

  const { id } = useLocalSearchParams<{ id: string }>();
  const { tags, selectedTags, setSelectedTags } = useTags();

  useEffect(() => {
    let isActive = true;
    fetchGoodsById(id).then((data) => {
      if (isActive) {
        setEditTitle(data?.title || "");
        setEditValue(data?.price?.toString() || "0.00");
        setEditText(data?.text || "");
        setSelectedTags(data?.tags || []);
        setEditImage(data?.images?.[0] || null);
        setArchiveReason(data?.archive_reason || "");
        setCurrentMethod(data?.archive_method || "");
      }
    });

    return () => {
      isActive = false;
    };
  }, [id, setSelectedTags]);

  const handleUpdate = async () => {
    try {
      const { error: EditError } = await supabase
        .from("goods")
        .update({
          archive_method: currentMethod || null,
          archive_reason: archiveReason || null,
        })
        .eq("goods_id", id)
        .select("goods_id");

      if (EditError) throw EditError;

      const { error: tagsError } = await supabase
        .from("goods_tags")
        .delete()
        .eq("goods_id", id);

      if (tagsError) throw tagsError;

      const tagRows = tags
        .filter((tag) => selectedTags.includes(tag.tag_name))
        .map((tag) => ({ goods_id: id, tag_id: tag.tag_id }));

      if (tagRows.length > 0) {
        const { error: newTagsError } = await supabase
          .from("goods_tags")
          .upsert(tagRows, {
            onConflict: "goods_id,tag_id",
          });

        if (newTagsError) throw newTagsError;
      }

      alert(t("edit.updated"));
      router.back();
    } catch (error) {
      console.log("NG", error);
    }
  };

  // const onClickUploadImage = () => {
  //   setUpDateImage(!upDateImage);
  // };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        className="flex-1 bg-background px-4"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View className="flex-row items-center px-4 pt-4 pb-2">
          <TouchableOpacity
            onPress={() => router.back()}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            className="p-2 -ml-2"
          >
            <MaterialIcons name="arrow-back" size={24} color="#F5F0E8" />
          </TouchableOpacity>
          <Text className="text-text-primary text-lg font-bold ml-2">
            {t("edit.title")}
          </Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          <View className="mx-4 rounded-xl overflow-hidden mb-5">
            <Image
              source={{ uri: editImage || "" }}
              style={{ width: "100%", height: 224 }}
              className="w-full h-56"
              contentFit="cover"
              transition={1000}
            />
          </View>

          <Text className="text-gold text-xs uppercase tracking-widest mb-2">
            {t("add.itemTitle")}
          </Text>
          <Text className="text-text-primary text-md">{editTitle}</Text>

          <Text className="text-gold text-xs uppercase tracking-widest mb-2 pt-4">
            {t("add.acquisitionValue")}
          </Text>
          <View className="rounded-xl  py-2 mb-5 flex-row items-center">
            <Text className="text-text-secondary mr-2">$</Text>
            <Text className="text-text-primary text-md">{editValue}</Text>
          </View>
          <Text className="text-gold text-xs uppercase tracking-widest mb-2">
            {t("add.category")}
          </Text>
          <View className="flex-row flex-wrap gap-2 mb-5">
            {ARCHIVE_METHODS.map((method) => (
              <Pressable
                key={method}
                onPress={() => setCurrentMethod(method)}
                className={`px-4 py-2 rounded-full border  ${
                  currentMethod === method
                    ? "bg-gold border-gold"
                    : "bg-surface border-border"
                }`}
              >
                <Text
                  className={`text-sm ${
                    currentMethod === method
                      ? "text-black font-bold"
                      : "text-text-secondary"
                  }`}
                >
                  {method}
                </Text>
              </Pressable>
            ))}
          </View>
          <Text className="text-gold text-xs uppercase tracking-widest mb-2">
            {t("add.intentReflection")}
          </Text>
          <View className=" rounded-xl  py-3">
            <Text className="text-text-primary text-md">{editText}</Text>
          </View>
          <Text className="text-gold text-xs uppercase tracking-widest mb-2">
            {t("add.archiveReason")}
          </Text>
          <View className="bg-surface border border-border rounded-xl px-4 py-3">
            <TextInput
              className="text-text-primary text-sm"
              placeholder={t("add.notePlaceholder")}
              placeholderTextColor="#555555"
              numberOfLines={4}
              scrollEnabled={false}
              textAlignVertical="top"
              value={archiveReason}
              onChangeText={setArchiveReason}
              style={{ minHeight: 100 }}
            />
          </View>
        </ScrollView>

        <View className="absolute bottom-0 left-0 right-0 flex-row gap-3 px-4 py-4 bg-background border-t border-border">
          <Pressable
            onPress={() => router.back()}
            className="flex-1 py-4 rounded-xl border border-border items-center active:opacity-70"
          >
            <Text className="text-text-primary font-semibold">
              {t("add.cancel")}
            </Text>
          </Pressable>
          <Pressable
            onPress={handleUpdate}
            className="flex-1 py-4 rounded-xl bg-gold items-center active:opacity-70"
          >
            <Text className="text-black font-bold">{t("add.updateItem")}</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
