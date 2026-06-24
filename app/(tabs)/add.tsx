import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
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

const PRESET_TAGS = ["Electronics", "Apparel", "Furniture", "Books", "Other"];

export default function AddScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [isKeep, setIsKeep] = useState(true);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [note, setNote] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View className="flex-row justify-between items-center px-4 pt-4 pb-2">
        <Text className="text-gold text-lg font-bold tracking-wider">Karireco</Text>
        <TouchableOpacity
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          className="p-2"
        >
          <MaterialIcons name="delete-outline" size={22} color="#555555" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View className="px-4 pt-2">
          <Pressable className="bg-surface border border-dashed border-border rounded-xl h-44 items-center justify-center mb-4 active:opacity-70">
            <MaterialIcons name="add-a-photo" size={32} color="#C9A84C" />
            <Text className="text-text-secondary text-sm mt-2">{t("add.addImage")}</Text>
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
            {t("add.itemDesignation")}
          </Text>
          <View className="bg-surface border border-border rounded-xl px-4 py-3 mb-5">
            <TextInput
              className="text-text-primary text-sm"
              placeholder={t("add.itemPlaceholder")}
              placeholderTextColor="#555555"
              value={title}
              onChangeText={setTitle}
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
              value={price}
              onChangeText={setPrice}
            />
          </View>

          <Text className="text-gold text-xs uppercase tracking-widest mb-2">
            {t("add.category")}
          </Text>
          <View className="flex-row flex-wrap gap-2 mb-5">
            {PRESET_TAGS.map((tag) => (
              <Pressable
                key={tag}
                onPress={() => toggleTag(tag)}
                className={`px-4 py-2 rounded-full border ${
                  selectedTags.includes(tag) ? "bg-gold border-gold" : "bg-surface border-border"
                }`}
              >
                <Text
                  className={`text-sm ${
                    selectedTags.includes(tag) ? "text-black font-bold" : "text-text-secondary"
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
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={note}
              onChangeText={setNote}
              style={{ minHeight: 100 }}
            />
          </View>
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 flex-row gap-3 px-4 py-4 bg-background border-t border-border">
        <Pressable
          onPress={() => router.dismiss()}
          className="flex-1 py-4 rounded-xl border border-border items-center active:opacity-70"
        >
          <Text className="text-text-primary font-semibold">{t("add.cancel")}</Text>
        </Pressable>
        <Pressable
          onPress={() => router.dismiss()}
          className="flex-1 py-4 rounded-xl bg-gold items-center active:opacity-70"
        >
          <Text className="text-black font-bold">{t("add.commitItem")}</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
