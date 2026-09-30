import { supabase } from "@/lib/supabase";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import React from "react";
import { Alert, Modal, Pressable, Text, View } from "react-native";

interface ArchiveMenuModalProps {
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

export default function ArchiveMenuModal({
  item,
  isOpen,
  isClosing,
}: ArchiveMenuModalProps) {
  const { t } = useTranslation();

  const handleEdit = async () => {
    // setIsSubmitting(true);
    try {
      router.push(`/archive/goods/edit/${item}`);
      isClosing();
    } catch (error) {
      console.error(error);
    }
  };

  const backToGoodsList = async (id: string) => {
    Alert.alert(
      t("menu.backToCollectionTitle"),
      t("menu.backToCollectionMessage"),
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
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
          },
        },
      ],
    );
  };

  const createTwoButtonAlert = (id: string) =>
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
          <Text className="text-text-primary  text-lg">{t("menu.edit")}</Text>
        </Pressable>
        <Pressable
          onPress={() => backToGoodsList(item)}
          className="flex-row py-8 px-4 rounded-xl items-left active:opacity-70"
        >
          <MaterialIcons
            name="archive"
            size={24}
            color={"#C9A84C"}
            className="pr-6"
          />
          <Text className="text-text-primary text-lg">{t("menu.backToCollection")}</Text>
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
          <Text className=" text-error text-lg ">{t("menu.delete")}</Text>
        </Pressable>
        <Pressable
          onPress={isClosing}
          className="px-4 py-8 items-center rounded-xl"
        >
          <Text className="text-text-primary ">{t("menu.cancel")}</Text>
        </Pressable>
      </View>
    </Modal>
  );
}
