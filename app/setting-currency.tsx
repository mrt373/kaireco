import { Feather, MaterialIcons } from "@expo/vector-icons";
import * as Localization from "expo-localization";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileEditScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  const locale = Localization.getLocales()[0]?.languageTag; // "ja-JP" など
  console.log(locale);

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
          通貨選択
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-4 pt-6"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <Text className="text-text-muted text-xs uppercase tracking-widest mb-2">
          Currency
        </Text>
        <Text className="text-text-muted text-xs uppercase tracking-widest mb-2">
          合計金額の通貨を選択できます
        </Text>
        <View
          // onChangeText={setName}
          className="bg-surface border border-border rounded-t-xl px-4 py-3 text-text-primary flex-row  justify-between"
        >
          <Text className="text-text-primary">日本円（JPY）</Text>
          <Feather name="check" size={24} color="#C9A84C" />
        </View>
        <View
          // onChangeText={setName}
          className="bg-surface border border-border rounded-b-xl px-4 py-3 text-text-primary mb-5 flex-row  justify-between"
        >
          <Text className="text-text-primary">米国ドル（USD）</Text>
          <Feather name="check" size={24} color="#C9A84C" />
        </View>

        <TouchableOpacity
          onPress={handleSave}
          className="bg-gold rounded-xl py-4 items-center mb-3 active:opacity-80 "
        >
          <Text className="text-background font-bold">{t("common.save")}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
