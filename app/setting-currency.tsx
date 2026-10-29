import { useAuth } from "@/lib/auth";
import { fetchUserProfile } from "@/lib/goods";
import { supabase } from "@/lib/supabase";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileEditScreen() {
  const { t } = useTranslation();
  // const router = useRouter();
  const [selectedCurrency, setSelectedCurrency] = useState("");

  const { session } = useAuth();
  // const locale = Localization.getLocales()[0]?.languageTag; // "ja-JP" など
  // console.log(locale + "現在の通貨");

  const currencies = [
    { value: "USD", label: "米国ドル（USD）" },
    { value: "JPY", label: "日本円（JPY）" },
  ];

  const handleUpdate = async () => {
    try {
      const { error: UpDateError } = await supabase
        .from("users_profile")
        .update({
          display_currency: selectedCurrency,
        })
        .eq("user_id", session?.user?.id);

      if (UpDateError) throw UpDateError;
      Alert.alert(t("edit.updated"));
      router.back();
    } catch (error) {
      console.log("NG", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (!session?.user) return;
      let isActive = true;
      fetchUserProfile(session.user.id).then((data) => {
        if (isActive)
          data && setSelectedCurrency(data.display_currency ?? "USD");
      });

      return () => {
        isActive = false;
      };
    }, [session?.user]),
  );

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
        <View className=" mb-6">
          {currencies.map((curr) => (
            <Pressable
              key={curr.value}
              onPress={() => setSelectedCurrency(curr.value)}
              className={`flex rounded-xl bg-surface border border-border px-4 py-6 text-text-primary flex-row  justify-between `}
            >
              <Text className="text-sm text-text-primary h-6 ">
                {curr.label}
              </Text>
              {selectedCurrency === curr.value ? (
                <Feather name="check" size={20} color="#C9A84C" />
              ) : null}
            </Pressable>
          ))}
        </View>

        <TouchableOpacity
          onPress={handleUpdate}
          className="bg-gold rounded-xl py-4 items-center mb-3 active:opacity-80 "
        >
          <Text className="text-background font-bold">{t("common.save")}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
