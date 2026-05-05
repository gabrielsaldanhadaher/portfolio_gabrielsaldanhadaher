import { ScrollView, Text, View, Pressable, FlatList, ActivityIndicator, Alert } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { CommunityCard } from "@/components/community-card";
import { MaterialIcons } from "@expo/vector-icons";
import { useColors } from "@/hooks/use-colors";
import { useAuth } from "@/hooks/use-auth";
import { trpc } from "@/lib/trpc";

export default function HomeScreen() {
  const colors = useColors();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  // Fetch featured communities
  const { data: communities = [], isLoading } = trpc.communities.list.useQuery();

  return (
    <ScreenContainer className="flex-1 p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View className="bg-primary px-6 py-8 rounded-b-3xl">
          <Text className="text-white text-4xl font-bold mb-2">IT Connect</Text>
          <Text className="text-white text-base opacity-90 mb-6">
            Conecte-se com profissionais de TI e colabore em projetos
          </Text>

          {!isAuthenticated ? (
            <Pressable
              onPress={() => {
                // Navigate to login
                Alert.alert("Login", "Implementar tela de login");
              }}
              style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
              className="bg-white px-6 py-3 rounded-lg items-center"
            >
              <Text className="text-primary font-bold">Fazer Login</Text>
            </Pressable>
          ) : (
            <View className="flex-row items-center gap-2">
              <View className="w-12 h-12 rounded-full bg-white bg-opacity-20 items-center justify-center">
                <MaterialIcons name="account-circle" size={24} color="#ffffff" />
              </View>
              <View className="flex-1">
                <Text className="text-white font-semibold">{user?.name || "Bem-vindo"}</Text>
                <Text className="text-white text-xs opacity-75">Pronto para colaborar</Text>
              </View>
            </View>
          )}
        </View>

        {/* Quick Stats */}
        <View className="flex-row gap-3 px-6 py-6">
          <View className="flex-1 bg-surface rounded-lg p-4 border border-border">
            <Text className="text-3xl font-bold text-primary">{communities.length}</Text>
            <Text className="text-xs text-muted mt-1">Comunidades</Text>
          </View>
          <View className="flex-1 bg-surface rounded-lg p-4 border border-border">
            <Text className="text-3xl font-bold text-primary">8+</Text>
            <Text className="text-xs text-muted mt-1">Categorias</Text>
          </View>
          <View className="flex-1 bg-surface rounded-lg p-4 border border-border">
            <Text className="text-3xl font-bold text-primary">30+</Text>
            <Text className="text-xs text-muted mt-1">Subcategorias</Text>
          </View>
        </View>

        {/* Featured Communities */}
        <View className="px-6 pb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold text-foreground">Comunidades em Destaque</Text>
            <Pressable onPress={() => router.push("/(tabs)/explore")}>
              <Text className="text-primary font-semibold">Ver todas</Text>
            </Pressable>
          </View>

          {isLoading ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : communities.length > 0 ? (
            <FlatList
              data={communities.slice(0, 3)}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <CommunityCard
                  name={item.name}
                  description={item.description || undefined}
                  memberCount={item.memberCount}
                  isPublic={item.isPublic}
                  onPress={() => router.push({ pathname: "/community-details", params: { id: item.id } })}
                />
              )}
            />
          ) : (
            <View className="items-center justify-center py-8">
              <MaterialIcons name="group-add" size={48} color={colors.muted} />
              <Text className="text-muted text-center mt-2">
                Nenhuma comunidade disponível
              </Text>
            </View>
          )}
        </View>

        {/* CTA Section */}
        <View className="px-6 pb-6">
          <View className="bg-gradient-to-r from-primary to-blue-600 rounded-xl p-6">
            <Text className="text-white text-xl font-bold mb-2">Comece Agora</Text>
            <Text className="text-white text-sm opacity-90 mb-4">
              Crie sua comunidade e comece a colaborar com profissionais de TI
            </Text>
            <Pressable
              onPress={() => router.push("/create-community")}
              style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
              className="bg-white px-6 py-3 rounded-lg items-center"
            >
              <Text className="text-primary font-bold">Criar Comunidade</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
