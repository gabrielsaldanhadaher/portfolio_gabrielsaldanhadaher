import { View, Text, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  name: string;
  color: string;
  icon?: string;
  memberCount?: number;
  onPress?: () => void;
  isSelected?: boolean;
}

export function CategoryCard({
  name,
  color,
  icon = "folder",
  memberCount,
  onPress,
  isSelected = false,
}: CategoryCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <View
        className={cn(
          "rounded-xl p-4 items-center justify-center gap-2",
          isSelected ? "bg-primary" : "bg-surface border border-border"
        )}
        style={{
          backgroundColor: isSelected ? color : undefined,
        }}
      >
        <MaterialIcons
          name={icon as any}
          size={32}
          color={isSelected ? "#ffffff" : color}
        />
        <Text
          className={cn(
            "text-sm font-semibold text-center",
            isSelected ? "text-white" : "text-foreground"
          )}
        >
          {name}
        </Text>
        {memberCount !== undefined && (
          <Text
            className={cn(
              "text-xs",
              isSelected ? "text-white opacity-80" : "text-muted"
            )}
          >
            {memberCount} membros
          </Text>
        )}
      </View>
    </Pressable>
  );
}
