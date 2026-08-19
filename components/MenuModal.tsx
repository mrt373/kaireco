import { supabase } from "@/lib/supabase";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { t } from "i18next";
import React, { useState } from "react";
import { Alert, Modal, Pressable, Text, TextInput, View } from "react-native";

interface MenuModalProps {
  isOpen: boolean;
  isClosing: () => void;
  item: string;
}

export const ARCHIVE_METHODS = [
  "donated",
  "sold",
  "recycled",
  "other",
] as const;

export default function MenuModal({ item, isOpen, isClosing }: MenuModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDelete, setIsdelete] = useState(false);
  const [showArchiveForm, setShowArchiveForm] = useState(false);
  const [editText, setEditText] = useState("");
  const [selectedTags, setSelectedTags] = useState<
    (typeof ARCHIVE_METHODS)[number][]
  >([]);

  const toggleTag = (tag: (typeof ARCHIVE_METHODS)[number]) => {
    setSelectedTags((current) =>
      current.includes(tag)
        ? current.filter((item) => item !== tag)
        : [...current, tag],
    );
  };

  const handleEdit = async () => {
    setIsSubmitting(true);
    try {
      router.push(`/goods/edit/${item}`);
      isClosing();
    } catch (error) {
      console.error(error);
    }
  };

  const handleArchive = async () => {
    setShowArchiveForm(true);
  };

  const handleSave = async () => {
    if (selectedTags.length === 0) {
      alert("手放し方を選択してください");
      return;
    }
    try {
      const { error } = await supabase
        .from("goods")
        .update({
          archived_at: new Date().toISOString(),
          archive_method: selectedTags[0],
          archive_reason: editText || null,
        })
        .eq("goods_id", item);
      if (error) throw error;
      isClosing();
      router.back();
    } catch (error) {
      console.log(JSON.stringify(error));
      alert("エラーが発生しました");
      console.log("selectedTags[0]:", selectedTags[0]);
    }
  };

  const createTwoButtonAlert = (id: string) =>
    Alert.alert("アイテム削除", "本当に削除しますか？", [
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
          isClosing();
          router.back();
        },
      },
    ]);

  const handleDelete = async (id: string) => {
    createTwoButtonAlert(id);
  };

  return (
    <Modal
      backdropColor="bg-surface"
      visible={isOpen}
      animationType="slide"
      onRequestClose={() => {
        alert("Modal has been closed.");
      }}
    >
      <View className="flex-1"></View>
      {showArchiveForm ? (
        <View className="flex-col  px-4 pt-4 pb-2  bg-background rounded-lg ">
          <Text className="text-gold text-sm uppercase tracking-widest mb-2">
            手放し方
          </Text>
          <View className="flex-row flex-wrap gap-2 mb-5">
            {ARCHIVE_METHODS.map((tag) => (
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

          <Text className="text-gold text-sm uppercase tracking-widest mb-2">
            手放した理由
          </Text>
          <TextInput
            className="bg-surface border border-border　color-white "
            placeholder={t("add.notePlaceholder")}
            placeholderTextColor="#555555"
            numberOfLines={4}
            scrollEnabled={false}
            textAlignVertical="top"
            value={editText}
            onChangeText={setEditText}
            style={{ minHeight: 100 }}
          />

          <Pressable
            onPress={handleSave}
            // disabled={isSubmitting}
            className="mt-5 py-4 rounded-xl bg-gold items-center active:opacity-70"
          >
            {/* <ActivityIndicator color="#0D0D0D" /> */}

            <Text className="text-black font-bold">アーカイブに移動</Text>
          </Pressable>
          <Pressable
            onPress={isClosing}
            className="px-4 py-8 items-center rounded-xl"
          >
            <Text className="text-text-primary ">キャンセル</Text>
          </Pressable>
        </View>
      ) : (
        <View className="flex-col  px-4 pt-4 pb-2  bg-background rounded-lg ">
          <Pressable
            onPress={handleEdit}
            className="flex-row py-8 px-4 items-left active:opacity-70 "
          >
            <MaterialIcons
              name="edit"
              size={24}
              color={"#C9A84C"}
              className="pr-6"
            />
            <Text className="text-text-primary  text-lg">編集する</Text>
          </Pressable>
          <Pressable
            onPress={handleArchive}
            className="flex-row py-8 px-4 rounded-xl items-left active:opacity-70"
          >
            <MaterialIcons
              name="archive"
              size={24}
              color={"#C9A84C"}
              className="pr-6"
            />
            <Text className="text-text-primary text-lg">アーカイブ</Text>
          </Pressable>
          <Pressable
            onPress={() => handleDelete(item)}
            className="flex-row  py-8 px-4  rounded-xl items-left active:opacity-70"
          >
            <MaterialIcons
              name="delete"
              size={24}
              color={"#FFB4AB"}
              className="pr-6"
            />
            <Text className=" text-error text-lg ">削除</Text>
          </Pressable>
          <Pressable
            onPress={isClosing}
            className="px-4 py-8 items-center rounded-xl"
          >
            <Text className="text-text-primary ">キャンセル</Text>
          </Pressable>
        </View>
      )}
    </Modal>
  );
}
