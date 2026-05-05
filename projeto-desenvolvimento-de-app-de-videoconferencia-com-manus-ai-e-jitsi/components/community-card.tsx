import { View, Text, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { cn } from "@/lib/utils";

interface CommunityCardProps {
  name: string;
  description?: string;
  memberCount: number;
  isPublic: boolean;
  categoryColor?: string;
  onPress?: () => void;
}

export function CommunityCard({
  name,
  description,
  memberCount,
  isPublic,
  categoryColor = "#0a7ea4",
  onPress,
}: CommunityCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <View className="bg-surface rounded-xl p-4 mb-3 border border-border">
        {/* Header */}
        <View className="flex-row items-start justify-between mb-2">
          <View className="flex-1">
            <Text className="text-lg font-bold text-foreground">{name}</Text>
            <View className="flex-row items-center gap-1 mt-1">
              <MaterialIcons
                name={isPublic ? "public" : "lock"}
                size={14}
                color="#687076"
              />
              <Text className="text-xs text-muted">
                {isPublic ? "Pública" : "Privada"}
              </Text>
            </View>
          </View>
          <View
            className="w-10 h-10 rounded-lg items-center justify-center"
            style={{ backgroundColor: categoryColor }}
          >
            <MaterialIcons name="people" size={20} color="#ffffff" />
          </View>
        </View>

        {/* Description */}
        {description && (
          <Text
            className="text-sm text-muted mb-2 leading-relaxed"
            numberOfLines={2}
          >
            {description}
          </Text>
        )}

        {/* Footer */}
        <View className="flex-row items-center justify-between pt-2 border-t border-border">
          <View className="flex-row items-center gap-1">
            <MaterialIcons name="people-outline" size={16} color="#687076" />
            <Text className="text-sm text-muted">{memberCount} membros</Text>
          </View>
          <MaterialIcons name="chevron-right" size={20} color="#0a7ea4" />
        </View>
      </View>
    </Pressable>
  );
}
