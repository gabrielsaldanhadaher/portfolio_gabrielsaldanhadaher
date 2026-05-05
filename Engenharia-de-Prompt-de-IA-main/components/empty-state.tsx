import { View, Text, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useColors } from "@/hooks/use-colors";

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

/**
 * Componente de estado vazio otimizado
 * Exibido quando não há dados para mostrar
 */
export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const colors = useColors();

  return (
    <View className="flex-1 items-center justify-center p-6">
      <View className="items-center gap-4">
        <View className="w-16 h-16 rounded-full bg-surface items-center justify-center">
          <MaterialIcons name={icon as any} size={32} color={colors.muted} />
        </View>

        <Text className="text-xl font-bold text-foreground text-center">{title}</Text>

        <Text className="text-sm text-muted text-center leading-relaxed">
          {description}
        </Text>

        {actionLabel && onAction && (
          <Pressable
            onPress={onAction}
            style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
            className="bg-primary px-6 py-3 rounded-lg mt-4"
          >
            <Text className="text-white font-semibold">{actionLabel}</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
