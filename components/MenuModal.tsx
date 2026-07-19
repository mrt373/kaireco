import { supabase } from "@/lib/supabase";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Modal, Pressable, Text, View } from "react-native";

interface MenuModalProps {
  isOpen: boolean;
  isClosing: () => void;
  item: string;
}

export default function MenuModal({ item, isOpen, isClosing }: MenuModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDelete, setIsdelete] = useState(false);

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
    alert("アーカイブ機能はまだ実装されていません。");
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
    </Modal>
  );
}
