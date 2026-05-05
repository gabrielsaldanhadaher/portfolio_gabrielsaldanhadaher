import { ScrollView, View, Text, Pressable, ActivityIndicator, FlatList, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { MaterialIcons } from "@expo/vector-icons";
import { useColors } from "@/hooks/use-colors";
import { useAuth } from "@/hooks/use-auth";
import { trpc } from "@/lib/trpc";

export default function CommunityDetailsScreen() {
  const colors = useColors();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { user, isAuthenticated } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMember, setIsMember] = useState(false);

  const communityId = typeof id === "string" ? parseInt(id) : null;

  // Fetch community details
  const { data: community, isLoading: communityLoading } =
    trpc.communities.byId.useQuery(
      { id: communityId! },
      { enabled: !!communityId }
    );

  // Fetch community members
  const { data: members = [] } = trpc.members.list.useQuery(
    { communityId: communityId! },
    { enabled: !!communityId }
  );

  // Join community mutation
  const joinMutation = trpc.members.join.useMutation({
    onSuccess: () => {
      setIsMember(true);
      Alert.alert("Sucesso", "Você entrou na comunidade!");
    },
    onError: (error) => {
      Alert.alert("Erro", error.message);
    },
  });

  // Leave community mutation
  const leaveMutation = trpc.members.leave.useMutation({
    onSuccess: () => {
      setIsMember(false);
      Alert.alert("Sucesso", "Você saiu da comunidade!");
    },
    onError: (error) => {
      Alert.alert("Erro", error.message);
    },
  });

  useEffect(() => {
    if (community && members && user) {
      const memberRecord = members.find((m) => m.userId === user.id);
      setIsMember(!!memberRecord);
      setIsAdmin(memberRecord?.isAdmin || false);
    }
  }, [community, members, user]);

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
        <View className="flex-row items-center justify-between mb-4">
          <Pressable onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
          </Pressable>
          {isAdmin && (
            <Pressable onPress={() => Alert.alert("Configurações", "Abrindo configurações da comunidade...")}>
              <MaterialIcons name="settings" size={24} color={colors.primary} />
            </Pressable>
          )}
        </View>

        {/* Community Info */}
        <View className="bg-surface rounded-xl p-6 mb-6 border border-border">
          <Text className="text-3xl font-bold text-foreground mb-2">{community.name}</Text>
          <View className="flex-row items-center gap-2 mb-4">
            <MaterialIcons
              name={community.isPublic ? "public" : "lock"}
              size={16}
              color={colors.muted}
            />
            <Text className="text-sm text-muted">
              {community.isPublic ? "Pública" : "Privada"}
            </Text>
          </View>
          {community.description && (
            <Text className="text-base text-foreground leading-relaxed">
              {community.description}
            </Text>
          )}
        </View>

        {/* Stats */}
        <View className="flex-row gap-3 mb-6">
          <View className="flex-1 bg-surface rounded-lg p-4 border border-border">
            <Text className="text-2xl font-bold text-primary">{community.memberCount}</Text>
            <Text className="text-xs text-muted mt-1">Membros</Text>
          </View>
          <View className="flex-1 bg-surface rounded-lg p-4 border border-border">
            <Text className="text-2xl font-bold text-primary">{members.length}</Text>
            <Text className="text-xs text-muted mt-1">Participantes</Text>
          </View>
        </View>

        {/* Action Buttons */}
        {isAuthenticated && (
          <View className="gap-3 mb-6">
            {!isMember ? (
              <Pressable
                onPress={() => joinMutation.mutate({ communityId: communityId! })}
                disabled={joinMutation.isPending}
                style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
                className="bg-primary px-6 py-3 rounded-lg items-center"
              >
                <Text className="text-white font-semibold">
                  {joinMutation.isPending ? "Entrando..." : "Entrar na Comunidade"}
                </Text>
              </Pressable>
            ) : (
              <>
                <Pressable
                  onPress={() => router.push(`/join-meeting?communityId=${communityId}`)}
                  style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
                  className="bg-primary px-6 py-3 rounded-lg flex-row items-center justify-center gap-2"
                >
                  <MaterialIcons name="videocam" size={20} color="#ffffff" />
                  <Text className="text-white font-semibold">Videoconferência</Text>
                </Pressable>
                <Pressable
                  onPress={() => leaveMutation.mutate({ communityId: communityId! })}
                  disabled={leaveMutation.isPending}
                  style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
                  className="bg-error px-6 py-3 rounded-lg items-center"
                >
                  <Text className="text-white font-semibold">
                    {leaveMutation.isPending ? "Saindo..." : "Sair da Comunidade"}
                  </Text>
                </Pressable>
              </>
            )}
          </View>
        )}

        {/* Members Section */}
        <Text className="text-lg font-bold text-foreground mb-3">Membros</Text>
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
              {isAdmin && item.userId !== user?.id && (
                <Pressable>
                  <MaterialIcons name="more-vert" size={20} color={colors.muted} />
                </Pressable>
              )}
            </View>
          )}
        />
      </ScrollView>
    </ScreenContainer>
  );
}
