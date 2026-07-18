import { fetchGoodsById } from "@/lib/goods";
import useTags from "@/lib/hooks/useTags";
import { supabase } from "@/lib/supabase";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { t } from "i18next";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GoodsEditScreen() {
  const [isKeep, setIsKeep] = useState(true);
  const [editTitle, setEditTitle] = useState("");
  const [editValue, setEditValue] = useState("");
  const [editText, setEditText] = useState("");
  const [SelectedItem, setSelectedItem] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const { id } = useLocalSearchParams<{ id: string }>();
  const { tags, selectedTags, setSelectedTags, toggleTag } = useTags();

  useEffect(() => {
    let isActive = true;
    fetchGoodsById(id)
      .then((data) => {
        if (isActive) setSelectedItem(data);
        setEditTitle(data?.title || "");
        setEditValue(data?.price?.toString() || "0.00");
        setEditText(data?.text || "");
        setSelectedTags(data?.tags || []);
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });
    return () => {
      isActive = false;
    };
  }, [id, setSelectedTags]);

  const handleUpdate = async () => {
    try {
      const { data: goods, error: EditError } = await supabase
        .from("goods")
        .update({
          title: editTitle,
          price: parseFloat(editValue) || 0,
          text: editText,
          status: isKeep ? "keep" : "to_sell",
        })
        .eq("goods_id", id);
      if (EditError) throw EditError;
      alert("更新しました");
      router.back();
    } catch (error) {
      console.log("NG");
    }
  };

  //   user_id: session.user.id,
  // title: title.trim(),
  // text: note.trim() || null,
  // price: parseFloat(price) || 0,
  // status: isKeep ? "keep" : "to_sell",

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
            商品編集
          </Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          <Pressable className="bg-surface border border-dashed border-border rounded-xl h-44 items-center justify-center mb-4 active:opacity-70">
            <MaterialIcons name="add-a-photo" size={32} color="#C9A84C" />
            <Text className="text-text-secondary text-sm mt-2">
              {t("add.addImage")}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => router.back()}
            className="flex-1 py-4 mb-8 justify-center rounded-xl border border-border  bg-surface items-center active:opacity-70 w-1/2 self-center"
          >
            <Text className="text-gold-muted-2 font-semibold flex align-middle  ">
              写真を変更する
            </Text>
          </Pressable>
          <View className="bg-surface border border-border rounded-xl px-4 py-4 mb-5">
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-text-primary text-sm font-semibold">
                  {t("add.curatedStatus")}
                </Text>
                <Text className="text-text-muted text-xs mt-0.5">
                  {isKeep ? t("add.statusKeep") : t("add.statusSell")}
                </Text>
              </View>
              <Switch
                value={isKeep}
                onValueChange={setIsKeep}
                trackColor={{ false: "#2A2A2A", true: "#8A6E2F" }}
                thumbColor={isKeep ? "#C9A84C" : "#555555"}
              />
            </View>
          </View>
          <Text className="text-gold text-xs uppercase tracking-widest mb-2">
            {t("add.itemTitle")}
          </Text>

          <View className="bg-surface border border-border rounded-xl px-4 py-3 mb-5">
            <TextInput
              className="text-text-primary text-sm"
              placeholder={editTitle || t("add.itemPlaceholder")}
              placeholderTextColor="#555555"
              value={editTitle}
              onChangeText={setEditTitle}
            />
          </View>

          <Text className="text-gold text-xs uppercase tracking-widest mb-2">
            {t("add.acquisitionValue")}
          </Text>
          <View className="bg-surface border border-border rounded-xl px-4 py-3 mb-5 flex-row items-center">
            <Text className="text-text-secondary mr-2">$</Text>
            <TextInput
              className="text-text-primary text-sm flex-1"
              placeholder="0.00"
              placeholderTextColor="#555555"
              keyboardType="decimal-pad"
              value={editValue}
              onChangeText={setEditValue}
            />
          </View>
          <Text className="text-gold text-xs uppercase tracking-widest mb-2">
            {t("add.category")}
          </Text>
          <View className="flex-row flex-wrap gap-2 mb-5">
            {tags.map((tag) => (
              <Pressable
                key={tag}
                onPress={() => toggleTag(tag)}
                className={`px-4 py-2 rounded-full border ${
                  selectedTags.includes(tag)
                    ? "bg-gold border-gold"
                    : "bg-surface border-border"
                }`}
              >
                <Text
                  className={`text-sm ${
                    selectedTags.includes(tag)
                      ? "text-black font-bold"
                      : "text-text-secondary"
                  }`}
                >
                  {tag}
                </Text>
              </Pressable>
            ))}
          </View>
          <Text className="text-gold text-xs uppercase tracking-widest mb-2">
            {t("add.intentReflection")}
          </Text>
          <View className="bg-surface border border-border rounded-xl px-4 py-3">
            <TextInput
              className="text-text-primary text-sm"
              placeholder={t("add.notePlaceholder")}
              placeholderTextColor="#555555"
              numberOfLines={4}
              scrollEnabled={false}
              textAlignVertical="top"
              value={editText}
              onChangeText={setEditText}
              style={{ minHeight: 100 }}
            />
          </View>
        </ScrollView>

        <View className="absolute bottom-0 left-0 right-0 flex-row gap-3 px-4 py-4 bg-background border-t border-border">
          <Pressable
            onPress={() => router.back()}
            className="flex-1 py-4 rounded-xl border border-border items-center active:opacity-70"
          >
            <Text className="text-text-primary font-semibold">キャンセル</Text>
          </Pressable>
          <Pressable
            onPress={handleUpdate}
            // disabled={isSubmitting}
            className="flex-1 py-4 rounded-xl bg-gold items-center active:opacity-70"
          >
            {/* <ActivityIndicator color="#0D0D0D" /> */}

            <Text className="text-black font-bold">更新する</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
