import { useEffect, useState } from "react";
import { View, Text, Pressable, Animated } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useColors } from "@/hooks/use-colors";

export type ToastType = "success" | "error" | "warning" | "info";

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onDismiss?: () => void;
}

/**
 * Componente de Toast otimizado
 * Exibir notificações rápidas e desaparecer automaticamente
 */
export function Toast({
  message,
  type = "info",
  duration = 3000,
  onDismiss,
}: ToastProps) {
  const colors = useColors();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onDismiss?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  if (!visible) return null;

  const typeConfig = {
    success: { bg: "bg-success/20", border: "border-success", icon: "check-circle", color: colors.success },
    error: { bg: "bg-error/20", border: "border-error", icon: "error", color: colors.error },
    warning: { bg: "bg-warning/20", border: "border-warning", icon: "warning", color: colors.warning },
    info: { bg: "bg-primary/20", border: "border-primary", icon: "info", color: colors.primary },
  };

  const config = typeConfig[type];

  return (
    <View className={`${config.bg} border ${config.border} rounded-lg p-4 flex-row items-center gap-3 mx-4 mb-4`}>
      <MaterialIcons name={config.icon as any} size={20} color={config.color} />
      <Text className="flex-1 text-foreground font-medium">{message}</Text>
      <Pressable onPress={() => setVisible(false)}>
        <MaterialIcons name="close" size={20} color={colors.muted} />
      </Pressable>
    </View>
  );
}
