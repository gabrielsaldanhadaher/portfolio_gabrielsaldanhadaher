import { ScrollView, View, Text, FlatList, TextInput, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { CategoryCard } from "@/components/category-card";
import { CommunityCard } from "@/components/community-card";
import { trpc } from "@/lib/trpc";
import { MaterialIcons } from "@expo/vector-icons";
import { useColors } from "@/hooks/use-colors";

export default function ExploreScreen() {
  const colors = useColors();
  const router = useRouter();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch categories
  const { data: categories = [], isLoading: categoriesLoading } =
    trpc.categories.list.useQuery();

  // Fetch communities by category or all public
  const { data: communities = [], isLoading: communitiesLoading } =
    selectedCategoryId
      ? trpc.communities.byCategory.useQuery({ categoryId: selectedCategoryId })
      : trpc.communities.list.useQuery();

  // Search communities
  const { data: searchResults = [] } = trpc.communities.search.useQuery(
    { query: searchQuery },
    { enabled: searchQuery.length > 0 }
  );

  const displayCommunities = searchQuery.length > 0 ? searchResults : communities;

  return (
    <ScreenContainer className="flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-foreground mb-2">Explorar</Text>
          <Text className="text-base text-muted">Descubra comunidades e conecte-se</Text>
        </View>

        {/* Search Bar */}
        <View className="mb-6 flex-row items-center bg-surface rounded-lg px-4 py-3 border border-border">
          <MaterialIcons name="search" size={20} color={colors.muted} />
          <TextInput
            placeholder="Buscar comunidades..."
            placeholderTextColor={colors.muted}
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
            className="flex-1 ml-2 text-foreground"
          />
        </View>

        {/* Categories Section */}
        {!searchQuery && (
          <>
            <Text className="text-lg font-bold text-foreground mb-3">Categorias</Text>
            {categoriesLoading ? (
              <ActivityIndicator size="large" color={colors.primary} />
            ) : (
              <FlatList
                data={categories}
                keyExtractor={(item) => item.id.toString()}
                numColumns={3}
                scrollEnabled={false}
                columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 12 }}
                renderItem={({ item }) => (
                  <View style={{ width: "31%" }}>
                    <CategoryCard
                      name={item.name}
                      color={item.color || "#0a7ea4"}
                      icon={item.icon || undefined}
                      isSelected={selectedCategoryId === item.id}
                      onPress={() =>
                        setSelectedCategoryId(
                          selectedCategoryId === item.id ? null : item.id
                        )
                      }
                    />
                  </View>
                )}
              />
            )}
            <View className="h-4" />
          </>
        )}

        {/* Communities Section */}
        <Text className="text-lg font-bold text-foreground mb-3">
          {searchQuery ? "Resultados da busca" : "Comunidades"}
        </Text>

        {communitiesLoading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : displayCommunities.length > 0 ? (
          <FlatList
            data={displayCommunities}
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
          <View className="items-center justify-center py-8">
            <MaterialIcons name="search-off" size={48} color={colors.muted} />
            <Text className="text-muted text-center mt-2">
              Nenhuma comunidade encontrada
            </Text>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
