import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Alert, Button, Image, Modal, Pressable, View } from "react-native";

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
  const [image, setImage] = useState<string | null>(imageUrl);

  const handleImageSelected = (uri: string) => {
    setImage(uri);
    onImageChange(uri);
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
      <View className="flex-row px-4 pt-4 pb-2  bg-background rounded-lg h-2/5 ">
        <Button title="Pick an image from camera roll" onPress={pickImage} />
        <Button title="Take a photo" onPress={takePhoto} />
        {image && (
          <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
        )}
      </View>
    </Modal>
  );
}
