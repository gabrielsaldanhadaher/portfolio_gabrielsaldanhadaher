import { View, ActivityIndicator } from "react-native";
import { useColors } from "@/hooks/use-colors";

interface LoadingSpinnerProps {
  size?: "small" | "large";
  color?: string;
  fullScreen?: boolean;
}

/**
 * Componente de loading otimizado
 * Reutilizável em toda a aplicação
 */
export function LoadingSpinner({
  size = "large",
  color,
  fullScreen = false,
}: LoadingSpinnerProps) {
  const colors = useColors();
  const spinnerColor = color || colors.primary;

  if (fullScreen) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size={size} color={spinnerColor} />
      </View>
    );
  }

  return <ActivityIndicator size={size} color={spinnerColor} />;
}
