import {
  ScrollView,
  View,
  Text,
  Pressable,
  TextInput,
  Switch,
  ActivityIndicator,
  FlatList,
  Alert,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { MaterialIcons } from "@expo/vector-icons";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import { CategoryCard } from "@/components/category-card";

export default function CreateCommunityScreen() {
  const colors = useColors();
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [isPublic, setIsPublic] = useState(true);

  // Fetch categories
  const { data: categories = [], isLoading: categoriesLoading } =
    trpc.categories.list.useQuery();

  // Create community mutation
  const createMutation = trpc.communities.create.useMutation({
    onSuccess: () => {
      Alert.alert("Sucesso", "Comunidade criada com sucesso!");
      router.back();
    },
    onError: (error) => {
      Alert.alert("Erro", error.message);
    },
  });

  const handleCreate = () => {
    if (!name.trim()) {
      Alert.alert("Erro", "Nome da comunidade é obrigatório");
      return;
    }

    if (!selectedCategoryId) {
      Alert.alert("Erro", "Selecione uma categoria");
      return;
    }

    createMutation.mutate({
      name: name.trim(),
      description: description.trim() || undefined,
      categoryId: selectedCategoryId,
      isPublic,
    });
  };

  return (
    <ScreenContainer className="flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-3xl font-bold text-foreground">Nova Comunidade</Text>
          <Pressable onPress={() => router.back()}>
            <MaterialIcons name="close" size={24} color={colors.foreground} />
          </Pressable>
        </View>

        {/* Name Input */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-foreground mb-2">Nome *</Text>
          <TextInput
            placeholder="Nome da comunidade"
            placeholderTextColor={colors.muted}
            value={name}
            onChangeText={setName}
            className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
          />
        </View>

        {/* Description Input */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-foreground mb-2">Descrição</Text>
          <TextInput
            placeholder="Descreva sua comunidade..."
            placeholderTextColor={colors.muted}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
          />
        </View>

        {/* Category Selection */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-foreground mb-3">Categoria *</Text>
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
        </View>

        {/* Privacy Toggle */}
        <View className="flex-row items-center justify-between bg-surface rounded-lg p-4 border border-border mb-6">
          <View className="flex-row items-center gap-3">
            <MaterialIcons
              name={isPublic ? "public" : "lock"}
              size={24}
              color={colors.primary}
            />
            <View>
              <Text className="text-foreground font-semibold">
                {isPublic ? "Pública" : "Privada"}
              </Text>
              <Text className="text-xs text-muted">
                {isPublic
                  ? "Qualquer um pode entrar"
                  : "Requer aprovação para entrar"}
              </Text>
            </View>
          </View>
          <Switch
            value={isPublic}
            onValueChange={setIsPublic}
            trackColor={{ false: colors.border, true: colors.primary }}
          />
        </View>

        {/* Create Button */}
        <Pressable
          onPress={handleCreate}
          disabled={createMutation.isPending || !name.trim() || !selectedCategoryId}
          style={({ pressed }) => [
            {
              opacity: pressed ? 0.8 : 1,
            },
          ]}
          className="bg-primary px-6 py-4 rounded-lg items-center"
        >
          <Text className="text-white font-bold text-lg">
            {createMutation.isPending ? "Criando..." : "Criar Comunidade"}
          </Text>
        </Pressable>
      </ScrollView>
    </ScreenContainer>
  );
}
