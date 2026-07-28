import useTags from "@/lib/hooks/useTags";
import { supabase } from "@/lib/supabase";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function ProfileEditScreen() {
  const router = useRouter();
  const [tag, setTag] = useState("");
  const { tags, fetchTags } = useTags();
  const numberOfTags = tags.length;

  const handleAdd = async () => {
    await supabase.from("tags").insert({ tag_name: tag });
    alert("タグを追加しました");
    fetchTags();
    setTag("");
  };

  const handleDelete = async (id: string) => {
    await supabase.from("tags").delete().eq("tag_id", id);
    console.log("削除するid:", id);

    fetchTags();
    alert("削除しました");
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
        {/* <Text className="text-gold-muted-3 text-md uppercase tracking-widest mb-2">
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
        </View> */}
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
            onPress={handleAdd}
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
            {numberOfTags} Tags
          </Text>
        </View>
        {tags.map((tag) => (
          <View
            key={tag.tag_id}
            className=" flex-row justify-between w-full text-text-primary bg-surface border border-border p-5 mt-3 rounded-sm "
          >
            <Text className="text-text-primary">{tag.tag_name}</Text>
            <TouchableOpacity onPress={() => handleDelete(tag.tag_id)}>
              <Ionicons name="trash-outline" size={20} color="#FFB4AB" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
