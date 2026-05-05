import { View, Text, Pressable, ActivityIndicator, Alert, ScrollView, Platform } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { MaterialIcons } from "@expo/vector-icons";
import { useColors } from "@/hooks/use-colors";
import { useAuth } from "@/hooks/use-auth";
import { trpc } from "@/lib/trpc";

/**
 * Tela para entrar em uma reunião ativa do Jitsi Meet
 * 
 * Permite que membros da comunidade entrem em uma reunião ativa
 * sem precisar iniciar uma nova.
 */
export default function JoinMeetingScreen() {
  const colors = useColors();
  const router = useRouter();
  const { communityId } = useLocalSearchParams();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const cId = typeof communityId === "string" ? parseInt(communityId) : null;

  // Fetch community details
  const { data: community } = trpc.communities.byId.useQuery(
    { id: cId! },
    { enabled: !!cId }
  );

  // Fetch active meeting
  const { data: activeMeeting, isLoading: meetingLoading } = trpc.meetings.active.useQuery(
    { communityId: cId! },
    { enabled: !!cId }
  );

  const handleJoinMeeting = () => {
    if (!activeMeeting?.jitsiRoomName) {
      Alert.alert("Erro", "Nenhuma reunião ativa no momento");
      return;
    }

    setIsLoading(true);

    try {
      if (Platform.OS === "web") {
        // Web: abrir Jitsi em nova aba
        const jitsiUrl = `https://meet.jit.si/${activeMeeting.jitsiRoomName}`;
        window.open(jitsiUrl, "_blank");
        Alert.alert("Sucesso", "Reunião aberta em uma nova aba!");
      } else {
        // Mobile: navegar para tela de videoconferência
        router.push(`/video-meeting?communityId=${cId}`);
      }
    } catch (error) {
      Alert.alert("Erro", "Falha ao entrar na reunião");
    } finally {
      setIsLoading(false);
    }
  };

  if (!cId) {
    return (
      <ScreenContainer className="flex-1 items-center justify-center">
        <Text className="text-foreground">Comunidade não encontrada</Text>
      </ScreenContainer>
    );
  }

  if (meetingLoading) {
    return (
      <ScreenContainer className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <Pressable onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
          </Pressable>
          <Text className="text-lg font-bold text-foreground">Entrar em Reunião</Text>
          <View className="w-6" />
        </View>

        {/* Community Info */}
        <View className="bg-surface rounded-xl p-6 mb-6 border border-border">
          <Text className="text-2xl font-bold text-foreground mb-2">{community?.name}</Text>
          <Text className="text-sm text-muted">Comunidade</Text>
        </View>

        {/* Meeting Status */}
        {activeMeeting ? (
          <View className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 mb-6 border border-green-200 dark:border-green-800">
            <View className="flex-row items-center gap-3 mb-4">
              <View className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/40 items-center justify-center">
                <MaterialIcons name="check-circle" size={24} color="#10B981" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold text-green-700 dark:text-green-400">
                  Reunião Ativa!
                </Text>
                <Text className="text-sm text-green-600 dark:text-green-300">
                  Há uma reunião em andamento agora
                </Text>
              </View>
            </View>

            <View className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4">
              <Text className="text-xs text-muted mb-1">Sala Jitsi</Text>
              <Text className="text-sm font-mono text-foreground break-words">
                {activeMeeting.jitsiRoomName}
              </Text>
            </View>

            <View className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <Text className="text-xs text-muted mb-1">Iniciada em</Text>
              <Text className="text-sm text-foreground">
                {new Date(activeMeeting.startedAt).toLocaleString("pt-BR")}
              </Text>
            </View>
          </View>
        ) : (
          <View className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6 mb-6 border border-yellow-200 dark:border-yellow-800">
            <View className="flex-row items-center gap-3">
              <View className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/40 items-center justify-center">
                <MaterialIcons name="info" size={24} color="#F59E0B" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold text-yellow-700 dark:text-yellow-400">
                  Nenhuma Reunião Ativa
                </Text>
                <Text className="text-sm text-yellow-600 dark:text-yellow-300">
                  Não há reunião em andamento no momento
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Instructions */}
        <View className="bg-surface rounded-xl p-6 mb-6 border border-border">
          <Text className="text-lg font-bold text-foreground mb-3">Como Participar</Text>
          <View className="gap-3">
            <View className="flex-row gap-3">
              <View className="w-8 h-8 rounded-full bg-primary items-center justify-center">
                <Text className="text-white font-bold text-sm">1</Text>
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-foreground">Clique em "Entrar"</Text>
                <Text className="text-sm text-muted">Você será direcionado para o Jitsi Meet</Text>
              </View>
            </View>
            <View className="flex-row gap-3">
              <View className="w-8 h-8 rounded-full bg-primary items-center justify-center">
                <Text className="text-white font-bold text-sm">2</Text>
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-foreground">Permita acesso</Text>
                <Text className="text-sm text-muted">Autorize câmera e microfone se solicitado</Text>
              </View>
            </View>
            <View className="flex-row gap-3">
              <View className="w-8 h-8 rounded-full bg-primary items-center justify-center">
                <Text className="text-white font-bold text-sm">3</Text>
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-foreground">Participe!</Text>
                <Text className="text-sm text-muted">Você está conectado à reunião</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="gap-3 mb-6">
          {activeMeeting ? (
            <Pressable
              onPress={handleJoinMeeting}
              disabled={isLoading}
              style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
              className="bg-primary px-6 py-4 rounded-lg items-center flex-row justify-center gap-2"
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <MaterialIcons name="videocam" size={20} color="#ffffff" />
              )}
              <Text className="text-white font-bold text-lg">
                {isLoading ? "Entrando..." : "Entrar na Reunião"}
              </Text>
            </Pressable>
          ) : (
            <Pressable
              disabled
              className="bg-gray-400 px-6 py-4 rounded-lg items-center flex-row justify-center gap-2 opacity-50"
            >
              <MaterialIcons name="videocam-off" size={20} color="#ffffff" />
              <Text className="text-white font-bold text-lg">Nenhuma Reunião Disponível</Text>
            </Pressable>
          )}

          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
            className="bg-surface px-6 py-3 rounded-lg items-center border border-border"
          >
            <Text className="text-foreground font-semibold">Voltar</Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
