import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password || (mode === "signUp" && !name)) {
      Alert.alert(t("auth.missingFields"));
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === "signIn") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;

        if (data.user) {
          const { error: profileError } = await supabase
            .from("users")
            .insert({ id: data.user.id, name, email });
          if (profileError) throw profileError;
        }

        if (!data.session) {
          Alert.alert(t("auth.confirmEmailTitle"), t("auth.confirmEmailMessage"));
        }
      }
    } catch (error) {
      Alert.alert(t("auth.errorTitle"), error instanceof Error ? error.message : String(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="px-6">
            <Text className="text-gold text-3xl font-bold text-center mb-1">Karireco</Text>
            <Text className="text-text-secondary text-sm text-center mb-8">
              {mode === "signIn" ? t("auth.signInSubtitle") : t("auth.signUpSubtitle")}
            </Text>

            {mode === "signUp" && (
              <>
                <Text className="text-text-muted text-xs uppercase tracking-widest mb-2">
                  {t("profileEdit.name")}
                </Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  className="bg-surface border border-border rounded-xl px-4 py-3 text-text-primary mb-5"
                  placeholderTextColor="#555555"
                />
              </>
            )}

            <Text className="text-text-muted text-xs uppercase tracking-widest mb-2">
              {t("profileEdit.email")}
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              className="bg-surface border border-border rounded-xl px-4 py-3 text-text-primary mb-5"
              placeholderTextColor="#555555"
            />

            <Text className="text-text-muted text-xs uppercase tracking-widest mb-2">
              {t("auth.password")}
            </Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              className="bg-surface border border-border rounded-xl px-4 py-3 text-text-primary mb-8"
              placeholderTextColor="#555555"
            />

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isSubmitting}
              className="bg-gold rounded-xl py-4 items-center mb-4 active:opacity-80"
            >
              {isSubmitting ? (
                <ActivityIndicator color="#0D0D0D" />
              ) : (
                <Text className="text-background font-bold">
                  {mode === "signIn" ? t("auth.signIn") : t("auth.signUp")}
                </Text>
              )}
            </TouchableOpacity>

            <Pressable
              onPress={() => setMode(mode === "signIn" ? "signUp" : "signIn")}
              className="items-center"
            >
              <Text className="text-text-secondary text-sm">
                {mode === "signIn" ? t("auth.switchToSignUp") : t("auth.switchToSignIn")}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
