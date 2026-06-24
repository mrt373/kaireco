import { MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function ProfileScreen() {
  const { t } = useTranslation();

  const MENU_ITEMS: {
    icon: keyof typeof MaterialIcons.glyphMap;
    label: string;
    description: string;
    destructive?: boolean;
  }[] = [
    {
      icon: "person-outline",
      label: t("profile.profileEdit"),
      description: t("profile.profileEditDesc"),
    },
    {
      icon: "notifications-none",
      label: t("profile.notifications"),
      description: t("profile.notificationsDesc"),
    },

    {
      icon: "logout",
      label: t("profile.logout"),
      description: t("profile.logoutDesc"),
      destructive: true,
    },
  ];

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <View className="px-4 pt-6">
        <View className="items-center mb-8">
          <View className="w-20 h-20 rounded-full bg-surface border-2 border-gold items-center justify-center mb-3">
            <MaterialIcons name="person" size={40} color="#C9A84C" />
          </View>
          <Text className="text-text-primary text-xl font-bold mb-1">
            Username
          </Text>
          <Text className="text-text-secondary text-sm">user@example.com</Text>
        </View>

        <View className="flex-row gap-3 mb-8">
          <View className="flex-1 bg-surface border border-border rounded-xl p-4 items-center">
            <Text className="text-gold text-2xl font-bold">3</Text>
            <Text className="text-text-secondary text-xs mt-1">
              {t("profile.items")}
            </Text>
          </View>
          <View className="flex-1 bg-surface border border-border rounded-xl p-4 items-center">
            <Text className="text-gold text-2xl font-bold">3</Text>
            <Text className="text-text-secondary text-xs mt-1">
              {t("profile.archived")}
            </Text>
          </View>
          <View className="flex-1 bg-surface border border-border rounded-xl p-4 items-center">
            <Text className="text-gold text-2xl font-bold">$9.5k</Text>
            <Text className="text-text-secondary text-xs mt-1">
              {t("profile.value")}
            </Text>
          </View>
        </View>

        <Text className="text-text-muted text-xs uppercase tracking-widest mb-3">
          {t("profile.accountSettings")}
        </Text>
        <View className="bg-surface border border-border rounded-xl overflow-hidden mb-6">
          {MENU_ITEMS.map((item, index) => (
            <Pressable
              key={item.label}
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

        <View className="flex-row justify-center gap-4 mb-4">
          <Text className="text-text-muted text-xs">
            {t("profile.privacyPolicy")}
          </Text>
          <Text className="text-text-muted text-xs">
            {t("profile.termsOfService")}
          </Text>
        </View>
        <Text className="text-text-muted text-xs text-center">
          © 2024 Karireco v1.0.0
        </Text>
      </View>
    </ScrollView>
  );
}
