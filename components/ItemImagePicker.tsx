import { supabase } from "@/lib/supabase";
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Alert, Image, Modal, Pressable, Text, View } from "react-native";

type Props = {
  imageUrl: string | null;
  onImageChange: (url: string) => void;
  isOpen: boolean;
  isClosing: () => void;
  image: string;
};

export default function ItemImagePicker({
  imageUrl,
  onImageChange,
  isOpen,
  isClosing,
}: Props) {
  const [image, setImage] = useState<string | null>(imageUrl);

  const handleImageSelected = async (uri: string) => {
    setImage(uri);
    const response = await fetch(uri);
    const blob = await response.blob();
    const fileName = `${crypto.randomUUID()}`;

    const { error } = await supabase.storage
      .from("images")
      .upload(fileName, blob);
    if (error) {
      console.log("画像をアップロードできませんでした");
    } else {
      const { data } = supabase.storage.from("images").getPublicUrl(fileName);
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
          <Text className="text-text-primary pb-5">アルバムから選択</Text>
          <SimpleLineIcons name="picture" size={45} color="#FFFFFF" />
        </Pressable>
        <Pressable
          onPress={takePhoto}
          className="mt-5 py-4 flex-1 w-1/2 h-2/5   rounded-xl   bg-surface-elevated items-center active:opacity-70"
        >
          <Text className="text-text-primary pb-5">写真を撮る</Text>
          <Ionicons name="camera-outline" size={50} color="#FFFFFF" />
        </Pressable>

        {image && (
          <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
        )}
      </View>
    </Modal>
  );
}
