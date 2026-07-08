import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
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
  const [name, setName] = useState("Username");
  const [email, setEmail] = useState("user@example.com");

  const handleSave = () => {
    Alert.alert(t("common.save"), t("profileEdit.savedMessage"));
    router.back();
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
          {t("profile.profileEdit")}
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-4 pt-6"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="items-center mb-8">
          <View className="w-20 h-20 rounded-full bg-surface border-2 border-gold items-center justify-center mb-3">
            <MaterialIcons name="person" size={40} color="#C9A84C" />
          </View>
          <TouchableOpacity>
            <Text className="text-gold text-sm font-semibold">
              {t("profileEdit.changePhoto")}
            </Text>
          </TouchableOpacity>
        </View>

        <Text className="text-text-muted text-xs uppercase tracking-widest mb-2">
          {t("profileEdit.name")}
        </Text>
        <TextInput
          value={name}
          onChangeText={setName}
          className="bg-surface border border-border rounded-xl px-4 py-3 text-text-primary mb-5"
          placeholderTextColor="#555555"
        />

        <Text className="text-text-muted text-xs uppercase tracking-widest mb-2">
          {t("profileEdit.email")}
        </Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          className="bg-surface border border-border rounded-xl px-4 py-3 text-text-primary mb-8"
          placeholderTextColor="#555555"
        />

        <TouchableOpacity
          onPress={handleSave}
          className="bg-gold rounded-xl py-4 items-center mb-3 active:opacity-80"
        >
          <Text className="text-background font-bold">{t("common.save")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.back()}
          className="rounded-xl py-4 items-center active:opacity-70"
        >
          <Text className="text-text-secondary font-semibold">
            {t("common.cancel")}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
