import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Switch, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotificationsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [pushEnabled, setPushEnabled] = useState(true);
  const [archiveReminders, setArchiveReminders] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState(false);

  const SWITCH_ITEMS: {
    key: string;
    label: string;
    description: string;
    value: boolean;
    onValueChange: (v: boolean) => void;
  }[] = [
    {
      key: "push",
      label: t("notifications.push"),
      description: t("notifications.pushDesc"),
      value: pushEnabled,
      onValueChange: setPushEnabled,
    },
    {
      key: "archive",
      label: t("notifications.archiveReminders"),
      description: t("notifications.archiveRemindersDesc"),
      value: archiveReminders,
      onValueChange: setArchiveReminders,
    },
    {
      key: "summary",
      label: t("notifications.weeklySummary"),
      description: t("notifications.weeklySummaryDesc"),
      value: weeklySummary,
      onValueChange: setWeeklySummary,
    },
  ];

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
          {t("profile.notifications")}
        </Text>
      </View>

      <View className="px-4 pt-6">
        <View className="bg-surface border border-border rounded-xl overflow-hidden">
          {SWITCH_ITEMS.map((item, index) => (
            <View
              key={item.key}
              className={`flex-row items-center px-4 py-4 ${
                index < SWITCH_ITEMS.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <View className="flex-1 mr-3">
                <Text className="text-text-primary text-sm font-semibold">
                  {item.label}
                </Text>
                <Text className="text-text-muted text-xs mt-0.5">
                  {item.description}
                </Text>
              </View>
              <Switch
                value={item.value}
                onValueChange={item.onValueChange}
                trackColor={{ false: "#2A2A2A", true: "#8A6E2F" }}
                thumbColor={item.value ? "#C9A84C" : "#888888"}
              />
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}
