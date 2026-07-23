import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function ProfileEditScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [tag, setTag] = useState("");

  const handleSave = () => {
    // Alert.alert(t("common.save"), t("profileEdit.savedMessage"));
    // router.back();
    alert("保存しました");
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View className="flex-row items-center px-4 pt-4 pb-2">
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          className="p-2 -ml-2"
        >
          <MaterialIcons name="arrow-back" size={24} color="#F5F0E8" />
        </TouchableOpacity>
        <Text className="text-text-primary text-lg font-bold ml-2">
          タグの管理
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-4 pt-6"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <Text className="text-gold-muted-3 text-md uppercase tracking-widest mb-2">
          タグを検索　FILTER TAGS
        </Text>
        <View className="bg-surface border border-border rounded-xl px-4 py-3 mb-3">
          <TextInput
            className="text-text-primary text-sm"
            placeholder={t("home.searchPlaceholder")}
            placeholderTextColor="#555555"
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <Text className="text-gold-muted-3 text-md uppercase tracking-widest mb-2 mt-5">
          タグの作成 CREATE NEW
        </Text>
        <View className="flex-row">
          <TextInput
            value={tag}
            onChangeText={setTag}
            autoCapitalize="none"
            className="bg-surface border border-border rounded-md px-4 py-3 text-text-primary w-4/5"
            placeholderTextColor="#555555"
          />
          <TouchableOpacity
            onPress={handleSave}
            className="bg-gold w-1/5 rounded-md py-4 items-centeractive:opacity-80"
          >
            <Text className="text-background font-bold px-4 text-center">
              Add
            </Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-between pt-10 ">
          <Text className="text-gold-muted-3 text-xl uppercase tracking-widest  font-bold ">
            Active Tags
          </Text>
          <Text className="text-text-primary bg-surface py-2 px-4 rounded-3xl">
            6 Tags
          </Text>
        </View>
        <View className=" flex-row justify-between w-full text-text-primary bg-surface border border-border p-5 mt-3 rounded-sm ">
          <Text className="text-text-primary">カメラ</Text>
          <Ionicons name="trash-outline" size={20} color="#FFB4AB" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
