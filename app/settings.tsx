import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Settings() {
  const { t } = useTranslation();
  const router = useRouter();
  // const [pushEnabled, setPushEnabled] = useState(true);
  // const [archiveReminders, setArchiveReminders] = useState(true);
  // const [weeklySummary, setWeeklySummary] = useState(false);

  const MENU_ITEMS: {
    icon: keyof typeof MaterialIcons.glyphMap;
    label: string;
    description: string;
    destructive?: boolean;
    onPress?: () => void;
  }[] = [
    {
      icon: "notifications-none",
      label: "通知設定",
      description: t("profile.profileEditDesc"),
      onPress: () => router.push("/notifications"),
    },

    {
      icon: "tag",
      label: "タグ設定",
      description: t("設定の変更"),
      onPress: () => router.push("/tags_edit"),
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
          各種設定
        </Text>
      </View>

      <View className="px-4 pt-6">
        {/* <View>
          <Text className="text-text-muted text-xs uppercase tracking-widest mb-3">
            各種設定
          </Text>
        </View> */}
        <View className="bg-surface border border-border rounded-xl overflow-hidden mb-6">
          {MENU_ITEMS.map((item, index) => (
            <Pressable
              key={item.label}
              onPress={item.onPress}
              className={`flex-row items-center px-4 py-4 active:opacity-70 ${
                index < MENU_ITEMS.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <View className="w-9 h-9 rounded-full bg-surface-elevated items-center justify-center mr-3">
                <MaterialIcons
                  name={item.icon}
                  size={18}
                  color={item.destructive ? "#ef4444" : "#C9A84C"}
                />
              </View>
              <View className="flex-1">
                <Text
                  className={`text-sm font-semibold ${
                    item.destructive ? "text-red-400" : "text-text-primary"
                  }`}
                >
                  {item.label}
                </Text>
                <Text className="text-text-muted text-xs mt-0.5">
                  {item.description}
                </Text>
              </View>
              {!item.destructive && (
                <MaterialIcons name="chevron-right" size={20} color="#555555" />
              )}
            </Pressable>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}
