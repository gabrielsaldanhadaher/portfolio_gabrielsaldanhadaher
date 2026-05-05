import { ScrollView, View, Text, Pressable, ActivityIndicator } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { MaterialIcons } from "@expo/vector-icons";
import { useColors } from "@/hooks/use-colors";
import { useAuth } from "@/hooks/use-auth";
import * as WebBrowser from "expo-web-browser";

export default function ProfileScreen() {
  const colors = useColors();
  const { user, isAuthenticated, loading, logout } = useAuth();

  const handleLogin = async () => {
    // Login will be handled by the auth hook
    // This is a placeholder for now
  };

  if (loading) {
    return (
      <ScreenContainer className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  if (!isAuthenticated) {
    return (
      <ScreenContainer className="flex-1 items-center justify-center">
        <MaterialIcons name="account-circle" size={64} color={colors.muted} />
        <Text className="text-foreground text-2xl font-bold mt-4">Bem-vindo!</Text>
        <Text className="text-muted text-center mt-2 px-4">
          Faça login para acessar seu perfil e comunidades
        </Text>
        <Pressable
          onPress={handleLogin}
          style={({ pressed }) => [
            {
              opacity: pressed ? 0.8 : 1,
            },
          ]}
          className="mt-6 bg-primary px-8 py-3 rounded-lg"
        >
          <Text className="text-white font-semibold text-center">Fazer Login</Text>
        </Pressable>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Text className="text-3xl font-bold text-foreground mb-6">Perfil</Text>

        {/* User Info Card */}
        <View className="bg-surface rounded-xl p-6 mb-6 border border-border">
          <View className="flex-row items-center mb-4">
            <View className="w-16 h-16 rounded-full bg-primary items-center justify-center">
              <MaterialIcons name="account-circle" size={40} color="#ffffff" />
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-xl font-bold text-foreground">{user?.name || "Usuário"}</Text>
              <Text className="text-sm text-muted">{user?.email || "email@exemplo.com"}</Text>
            </View>
          </View>
        </View>

        {/* Settings Section */}
        <Text className="text-lg font-bold text-foreground mb-3">Configurações</Text>

        {/* Settings Items */}
        <View className="bg-surface rounded-xl border border-border overflow-hidden mb-6">
          <SettingItem
            icon="notifications"
            label="Notificações"
            onPress={() => {}}
          />
          <SettingItem
            icon="lock"
            label="Privacidade"
            onPress={() => {}}
          />
          <SettingItem
            icon="palette"
            label="Tema"
            onPress={() => {}}
          />
          <SettingItem
            icon="info"
            label="Sobre"
            onPress={() => {}}
          />
        </View>

        {/* Logout Button */}
        <Pressable
          onPress={logout}
          style={({ pressed }) => [
            {
              opacity: pressed ? 0.8 : 1,
            },
          ]}
          className="bg-error px-6 py-3 rounded-lg items-center"
        >
          <Text className="text-white font-semibold">Sair</Text>
        </Pressable>
      </ScrollView>
    </ScreenContainer>
  );
}

interface SettingItemProps {
  icon: string;
  label: string;
  onPress?: () => void;
}

function SettingItem({ icon, label, onPress }: SettingItemProps) {
  const colors = useColors();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.7 : 1,
        },
      ]}
      className="flex-row items-center justify-between px-4 py-4 border-b border-border"
    >
      <View className="flex-row items-center gap-3">
        <MaterialIcons name={icon as any} size={24} color={colors.primary} />
        <Text className="text-foreground font-medium">{label}</Text>
      </View>
      <MaterialIcons name="chevron-right" size={20} color={colors.muted} />
    </Pressable>
  );
}
