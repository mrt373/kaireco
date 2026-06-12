import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, ScrollView, Text, View } from "react-native";

const MENU_ITEMS: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  description: string;
  destructive?: boolean;
}[] = [
  {
    icon: "person-outline",
    label: "Profile Edit",
    description: "Update your personal information",
  },
  {
    icon: "notifications-none",
    label: "Notification Settings",
    description: "Manage your alerts and summaries",
  },
  {
    icon: "download",
    label: "Data Export",
    description: "Download your archive in PDF/CSV",
  },
  {
    icon: "logout",
    label: "Logout",
    description: "Securely end your current session",
    destructive: true,
  },
];

export default function ProfileScreen() {
  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ paddingBottom: 100 }}>
      <View className="px-4 pt-6">
        {/* アバター・ユーザー情報 */}
        <View className="items-center mb-8">
          <View className="w-20 h-20 rounded-full bg-surface border-2 border-gold items-center justify-center mb-3">
            <MaterialIcons name="person" size={40} color="#C9A84C" />
          </View>
          <Text className="text-text-primary text-xl font-bold mb-1">Username</Text>
          <Text className="text-text-secondary text-sm">user@example.com</Text>
        </View>

        {/* 統計サマリー */}
        <View className="flex-row gap-3 mb-8">
          <View className="flex-1 bg-surface border border-border rounded-xl p-4 items-center">
            <Text className="text-gold text-2xl font-bold">3</Text>
            <Text className="text-text-secondary text-xs mt-1">Items</Text>
          </View>
          <View className="flex-1 bg-surface border border-border rounded-xl p-4 items-center">
            <Text className="text-gold text-2xl font-bold">3</Text>
            <Text className="text-text-secondary text-xs mt-1">Archived</Text>
          </View>
          <View className="flex-1 bg-surface border border-border rounded-xl p-4 items-center">
            <Text className="text-gold text-2xl font-bold">$9.5k</Text>
            <Text className="text-text-secondary text-xs mt-1">Value</Text>
          </View>
        </View>

        {/* メニュー */}
        <Text className="text-text-muted text-xs uppercase tracking-widest mb-3">
          Account Settings
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

        {/* フッター */}
        <View className="flex-row justify-center gap-4 mb-4">
          <Text className="text-text-muted text-xs">Privacy Policy</Text>
          <Text className="text-text-muted text-xs">Terms of Service</Text>
        </View>
        <Text className="text-text-muted text-xs text-center">
          © 2024 Karireco v1.0.0
        </Text>
      </View>
    </ScrollView>
  );
}
