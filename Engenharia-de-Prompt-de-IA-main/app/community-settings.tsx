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
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { MaterialIcons } from "@expo/vector-icons";
import { useColors } from "@/hooks/use-colors";
import { useAuth } from "@/hooks/use-auth";
import { trpc } from "@/lib/trpc";

export default function CommunitySettingsScreen() {
  const colors = useColors();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { user } = useAuth();

  const communityId = typeof id === "string" ? parseInt(id) : null;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [activeTab, setActiveTab] = useState<"info" | "members" | "settings">("info");

  // Fetch community
  const { data: community, isLoading: communityLoading } =
    trpc.communities.byId.useQuery(
      { id: communityId! },
      { enabled: !!communityId }
    );

  // Fetch members
  const { data: members = [] } = trpc.members.list.useQuery(
    { communityId: communityId! },
    { enabled: !!communityId }
  );

  // Update community mutation
  const updateMutation = trpc.communities.update.useMutation({
    onSuccess: () => {
      Alert.alert("Sucesso", "Comunidade atualizada!");
    },
    onError: (error) => {
      Alert.alert("Erro", error.message);
    },
  });

  // Delete community mutation
  const deleteMutation = trpc.communities.delete.useMutation({
    onSuccess: () => {
      Alert.alert("Sucesso", "Comunidade deletada!");
      router.back();
    },
    onError: (error) => {
      Alert.alert("Erro", error.message);
    },
  });

  // Promote admin mutation
  const promoteAdminMutation = trpc.members.promoteAdmin.useMutation({
    onSuccess: () => {
      Alert.alert("Sucesso", "Membro promovido a admin!");
    },
    onError: (error) => {
      Alert.alert("Erro", error.message);
    },
  });

  // Remove admin mutation
  const removeAdminMutation = trpc.members.removeAdmin.useMutation({
    onSuccess: () => {
      Alert.alert("Sucesso", "Admin removido!");
    },
    onError: (error) => {
      Alert.alert("Erro", error.message);
    },
  });

  // Kick member mutation
  const kickMutation = trpc.members.kick.useMutation({
    onSuccess: () => {
      Alert.alert("Sucesso", "Membro removido!");
    },
    onError: (error) => {
      Alert.alert("Erro", error.message);
    },
  });

  useEffect(() => {
    if (community) {
      setName(community.name);
      setDescription(community.description || "");
      setIsPublic(community.isPublic);
    }
  }, [community]);

  if (!communityId) {
    return (
      <ScreenContainer className="flex-1 items-center justify-center">
        <Text className="text-foreground">Comunidade não encontrada</Text>
      </ScreenContainer>
    );
  }

  if (communityLoading) {
    return (
      <ScreenContainer className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  if (!community) {
    return (
      <ScreenContainer className="flex-1 items-center justify-center">
        <Text className="text-foreground">Comunidade não encontrada</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-3xl font-bold text-foreground">Configurações</Text>
          <Pressable onPress={() => router.back()}>
            <MaterialIcons name="close" size={24} color={colors.foreground} />
          </Pressable>
        </View>

        {/* Tabs */}
        <View className="flex-row gap-2 mb-6">
          {(["info", "members", "settings"] as const).map((tab) => (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-lg items-center ${
                activeTab === tab ? "bg-primary" : "bg-surface border border-border"
              }`}
            >
              <Text
                className={`font-semibold capitalize ${
                  activeTab === tab ? "text-white" : "text-foreground"
                }`}
              >
                {tab === "info" ? "Info" : tab === "members" ? "Membros" : "Config"}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Info Tab */}
        {activeTab === "info" && (
          <View className="gap-4">
            <View>
              <Text className="text-sm font-semibold text-foreground mb-2">Nome</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              />
            </View>

            <View>
              <Text className="text-sm font-semibold text-foreground mb-2">Descrição</Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              />
            </View>

            <View className="flex-row items-center justify-between bg-surface rounded-lg p-4 border border-border">
              <View className="flex-row items-center gap-3">
                <MaterialIcons
                  name={isPublic ? "public" : "lock"}
                  size={24}
                  color={colors.primary}
                />
                <Text className="text-foreground font-semibold">
                  {isPublic ? "Pública" : "Privada"}
                </Text>
              </View>
              <Switch
                value={isPublic}
                onValueChange={setIsPublic}
                trackColor={{ false: colors.border, true: colors.primary }}
              />
            </View>

            <Pressable
              onPress={() => updateMutation.mutate({ id: communityId, name, description, isPublic })}
              disabled={updateMutation.isPending}
              className="bg-primary px-6 py-3 rounded-lg items-center"
            >
              <Text className="text-white font-semibold">
                {updateMutation.isPending ? "Salvando..." : "Salvar Alterações"}
              </Text>
            </Pressable>
          </View>
        )}

        {/* Members Tab */}
        {activeTab === "members" && (
          <View>
            <Text className="text-lg font-bold text-foreground mb-3">
              Membros ({members.length})
            </Text>
            <FlatList
              data={members}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View className="flex-row items-center justify-between bg-surface rounded-lg p-3 mb-2 border border-border">
                  <View className="flex-row items-center gap-3 flex-1">
                    <View className="w-10 h-10 rounded-full bg-primary items-center justify-center">
                      <MaterialIcons name="account-circle" size={20} color="#ffffff" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-foreground font-medium">Usuário #{item.userId}</Text>
                      {item.isAdmin && (
                        <View className="flex-row items-center gap-1 mt-1">
                          <MaterialIcons name="shield" size={12} color={colors.primary} />
                          <Text className="text-xs text-primary font-semibold">Admin</Text>
                        </View>
                      )}
                    </View>
                  </View>
                  {item.userId !== user?.id && (
                    <Pressable
                      onPress={() => {
                        Alert.alert(
                          "Ações",
                          "O que deseja fazer?",
                          [
                            {
                              text: item.isAdmin ? "Remover Admin" : "Promover Admin",
                              onPress: () => {
                                if (item.isAdmin) {
                                  removeAdminMutation.mutate({
                                    communityId,
                                    userId: item.userId,
                                  });
                                } else {
                                  promoteAdminMutation.mutate({
                                    communityId,
                                    userId: item.userId,
                                  });
                                }
                              },
                            },
                            {
                              text: "Expulsar",
                              onPress: () => {
                                kickMutation.mutate({
                                  communityId,
                                  userId: item.userId,
                                });
                              },
                            },
                            { text: "Cancelar" },
                          ]
                        );
                      }}
                    >
                      <MaterialIcons name="more-vert" size={20} color={colors.muted} />
                    </Pressable>
                  )}
                </View>
              )}
            />
          </View>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <View className="gap-4">
            <Pressable
              onPress={() => {
                Alert.alert(
                  "Deletar Comunidade",
                  "Tem certeza? Esta ação não pode ser desfeita.",
                  [
                    { text: "Cancelar" },
                    {
                      text: "Deletar",
                      onPress: () => deleteMutation.mutate({ id: communityId }),
                    },
                  ]
                );
              }}
              disabled={deleteMutation.isPending}
              className="bg-error px-6 py-3 rounded-lg items-center"
            >
              <Text className="text-white font-semibold">
                {deleteMutation.isPending ? "Deletando..." : "Deletar Comunidade"}
              </Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
