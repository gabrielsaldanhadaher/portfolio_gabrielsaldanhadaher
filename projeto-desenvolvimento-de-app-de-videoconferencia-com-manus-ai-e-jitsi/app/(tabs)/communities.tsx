import { ScrollView, View, Text, FlatList, ActivityIndicator, Pressable } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { CommunityCard } from "@/components/community-card";
import { trpc } from "@/lib/trpc";
import { MaterialIcons } from "@expo/vector-icons";
import { useColors } from "@/hooks/use-colors";
import { useAuth } from "@/hooks/use-auth";

export default function CommunitiesScreen() {
  const colors = useColors();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  // Fetch user communities
  const { data: communities = [], isLoading } = trpc.communities.userCommunities.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  if (!isAuthenticated) {
    return (
      <ScreenContainer className="flex-1 items-center justify-center">
        <MaterialIcons name="lock" size={48} color={colors.muted} />
        <Text className="text-foreground text-lg font-semibold mt-4">
          Faça login para ver suas comunidades
        </Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text className="text-3xl font-bold text-foreground">Minhas Comunidades</Text>
            <Text className="text-base text-muted">
              {communities.length} comunidades
            </Text>
          </View>
          <Pressable
            onPress={() => router.push('/create-community')}
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            className="w-12 h-12 rounded-full bg-primary items-center justify-center"
          >
            <MaterialIcons name="add" size={24} color="#ffffff" />
          </Pressable>
        </View>

        {/* Communities List */}
        {isLoading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : communities.length > 0 ? (
          <FlatList
            data={communities}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <CommunityCard
                name={item.name}
                description={item.description || undefined}
                memberCount={item.memberCount}
                isPublic={item.isPublic}
                onPress={() => router.push({ pathname: '/community-details', params: { id: item.id } })}
              />
            )}
          />
        ) : (
          <View className="flex-1 items-center justify-center">
            <MaterialIcons name="group-add" size={48} color={colors.muted} />
            <Text className="text-foreground text-lg font-semibold mt-4">
              Nenhuma comunidade ainda
            </Text>
            <Text className="text-muted text-center mt-2 px-4">
              Explore comunidades e junte-se a uma para começar
            </Text>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
