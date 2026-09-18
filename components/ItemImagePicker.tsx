import { supabase } from "@/lib/supabase";
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import * as Crypto from "expo-crypto";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import { Alert, Modal, Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

type Props = {
  imageUrl: string | null;
  onImageChange: (url: string) => void;
  isOpen: boolean;
  isClosing: () => void;
};

export default function ItemImagePicker({
  imageUrl,
  onImageChange,
  isOpen,
  isClosing,
}: Props) {
  const { t } = useTranslation();
  const handleImageSelected = async (uri: string) => {
    const fileName = Crypto.randomUUID();
    const formData = new FormData();
    formData.append("file", {
      uri,
      name: fileName,
      type: "image/jpeg",
    } as any);

    const { error } = await supabase.storage
      .from("goods-images")
      .upload(fileName, formData);

    if (error) {
      console.log(
        "画像をアップロードできませんでした",
        JSON.stringify(error),
        imageUrl,
      );
    } else {
      const { data } = supabase.storage
        .from("goods-images")
        .getPublicUrl(fileName);
      onImageChange(data.publicUrl);
      console.log("アップロードできました");
    }
    isClosing();
  };

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission required",
        "Permission to access the media library is required.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      handleImageSelected(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission required",
        "Permission to access the camera is required.",
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      handleImageSelected(result.assets[0].uri);
    }
  };

  return (
    <Modal
      backdropColor="bg-surface"
      visible={isOpen}
      transparent
      animationType="slide"
      onRequestClose={isClosing}
    >
      <Pressable className="flex-1" onPress={isClosing} />
      <View className="flex-row   gap-3 px-4 pt-4 pb-2  bg-background rounded-lg h-1/2 ">
        <Pressable
          onPress={pickImage}
          className="mt-5 flex-1 w-1/2 h-2/5  py-4 rounded-x bg-surface-elevated items-center active:opacity-70"
        >
          <Text className="text-text-primary pb-5">{t("imagePicker.pickFromAlbum")}</Text>
          <SimpleLineIcons name="picture" size={45} color="#FFFFFF" />
        </Pressable>
        <Pressable
          onPress={takePhoto}
          className="mt-5 py-4 flex-1 w-1/2 h-2/5   rounded-xl   bg-surface-elevated items-center active:opacity-70"
        >
          <Text className="text-text-primary pb-5">{t("imagePicker.takePhoto")}</Text>
          <Ionicons name="camera-outline" size={50} color="#FFFFFF" />
        </Pressable>
      </View>
    </Modal>
  );
}
