import React, { ReactNode } from "react";
import { View, Text, Pressable } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { MaterialIcons } from "@expo/vector-icons";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, retry: () => void) => ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary Component
 * Captura erros em componentes filhos e exibe UI de fallback
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[ErrorBoundary] Caught error:", error);
    console.error("[ErrorBoundary] Error info:", errorInfo);
  }

  retry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      return this.props.fallback ? (
        this.props.fallback(this.state.error, this.retry)
      ) : (
        <DefaultErrorFallback error={this.state.error} retry={this.retry} />
      );
    }

    return this.props.children;
  }
}

interface DefaultErrorFallbackProps {
  error: Error;
  retry: () => void;
}

function DefaultErrorFallback({ error, retry }: DefaultErrorFallbackProps) {
  const colors = useColors();

  return (
    <View className="flex-1 bg-background items-center justify-center p-6">
      <View className="items-center gap-4">
        <View className="w-16 h-16 rounded-full bg-error/20 items-center justify-center">
          <MaterialIcons name="error-outline" size={32} color={colors.error} />
        </View>

        <Text className="text-2xl font-bold text-foreground text-center">
          Algo deu errado
        </Text>

        <Text className="text-sm text-muted text-center leading-relaxed">
          Desculpe, ocorreu um erro inesperado. Tente novamente ou entre em contato com o suporte.
        </Text>

        {__DEV__ && (
          <View className="bg-surface rounded-lg p-4 w-full border border-error/30 mt-4">
            <Text className="text-xs font-mono text-error mb-2">Erro:</Text>
            <Text className="text-xs font-mono text-foreground">{error.message}</Text>
          </View>
        )}

        <Pressable
          onPress={retry}
          style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
          className="bg-primary px-6 py-3 rounded-lg w-full items-center mt-4"
        >
          <Text className="text-white font-semibold">Tentar Novamente</Text>
        </Pressable>
      </View>
    </View>
  );
}
