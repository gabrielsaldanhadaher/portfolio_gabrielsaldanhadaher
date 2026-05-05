import {
  ScrollView,
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { MaterialIcons } from "@expo/vector-icons";
import { useColors } from "@/hooks/use-colors";
import { useAuth } from "@/hooks/use-auth";
import * as Auth from "@/lib/_core/auth";

export default function LoginScreen() {
  const colors = useColors();
  const router = useRouter();
  const { refresh } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Erro", "Por favor, preencha email e senha");
      return;
    }

    setIsLoading(true);
    try {
      // Simular login com credenciais de demo
      if (email === "demo@example.com" && password === "demo123456") {
        // Simular token de sessão
        const mockToken = "demo_token_" + Date.now();
        await Auth.setSessionToken(mockToken);

        // Simular dados do usuário
        const mockUser = {
          id: 1,
          openId: "demo_user",
          name: "Usuário Demo",
          email: "demo@example.com",
          loginMethod: "email",
          lastSignedIn: new Date(),
        };
        await Auth.setUserInfo(mockUser);

        // Atualizar estado de autenticação
        await refresh();
        router.replace("/(tabs)");
      } else {
        Alert.alert(
          "Erro de Login",
          "Email ou senha incorretos.\n\nUse:\nEmail: demo@example.com\nSenha: demo123456"
        );
      }
    } catch (error) {
      Alert.alert(
        "Erro de Login",
        error instanceof Error ? error.message : "Falha ao fazer login"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert("Erro", "Por favor, preencha todos os campos");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não correspondem");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setIsLoading(true);
    try {
      // Simular cadastro
      const mockToken = "demo_token_" + Date.now();
      await Auth.setSessionToken(mockToken);

      const mockUser = {
        id: Math.floor(Math.random() * 10000),
        openId: email.split("@")[0],
        name: name,
        email: email,
        loginMethod: "email",
        lastSignedIn: new Date(),
      };
      await Auth.setUserInfo(mockUser);

      Alert.alert("Sucesso", "Conta criada com sucesso!");
      await refresh();
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert(
        "Erro de Cadastro",
        error instanceof Error ? error.message : "Falha ao criar conta"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScreenContainer className="flex-1 p-0">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View className="bg-primary px-6 py-12 items-center">
            <View className="w-20 h-20 rounded-full bg-white bg-opacity-20 items-center justify-center mb-4">
              <MaterialIcons name="computer" size={40} color="#ffffff" />
            </View>
            <Text className="text-white text-3xl font-bold">IT Connect</Text>
            <Text className="text-white text-sm opacity-80 mt-2">
              Conecte-se com profissionais de TI
            </Text>
          </View>

          {/* Form Section */}
          <View className="flex-1 px-6 py-8">
            {/* Tabs */}
            <View className="flex-row gap-2 mb-8">
              <Pressable
                onPress={() => {
                  setIsSignUp(false);
                  setEmail("");
                  setPassword("");
                  setConfirmPassword("");
                  setName("");
                }}
                className={`flex-1 py-3 rounded-lg items-center ${
                  !isSignUp ? "bg-primary" : "bg-surface border border-border"
                }`}
              >
                <Text
                  className={`font-semibold ${
                    !isSignUp ? "text-white" : "text-foreground"
                  }`}
                >
                  Login
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setIsSignUp(true);
                  setEmail("");
                  setPassword("");
                  setConfirmPassword("");
                  setName("");
                }}
                className={`flex-1 py-3 rounded-lg items-center ${
                  isSignUp ? "bg-primary" : "bg-surface border border-border"
                }`}
              >
                <Text
                  className={`font-semibold ${
                    isSignUp ? "text-white" : "text-foreground"
                  }`}
                >
                  Cadastro
                </Text>
              </Pressable>
            </View>

            {/* Sign Up Fields */}
            {isSignUp && (
              <View className="mb-4">
                <Text className="text-sm font-semibold text-foreground mb-2">
                  Nome Completo
                </Text>
                <TextInput
                  placeholder="Seu nome"
                  placeholderTextColor={colors.muted}
                  value={name}
                  onChangeText={setName}
                  editable={!isLoading}
                  className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
                />
              </View>
            )}

            {/* Email Field */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-foreground mb-2">
                Email
              </Text>
              <TextInput
                placeholder="seu@email.com"
                placeholderTextColor={colors.muted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
                className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              />
            </View>

            {/* Password Field */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-foreground mb-2">
                Senha
              </Text>
              <View className="flex-row items-center bg-surface border border-border rounded-lg px-4 py-3">
                <TextInput
                  placeholder="Sua senha"
                  placeholderTextColor={colors.muted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  editable={!isLoading}
                  className="flex-1 text-foreground"
                />
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  <MaterialIcons
                    name={showPassword ? "visibility" : "visibility-off"}
                    size={20}
                    color={colors.muted}
                  />
                </Pressable>
              </View>
            </View>

            {/* Confirm Password Field (Sign Up only) */}
            {isSignUp && (
              <View className="mb-6">
                <Text className="text-sm font-semibold text-foreground mb-2">
                  Confirmar Senha
                </Text>
                <View className="flex-row items-center bg-surface border border-border rounded-lg px-4 py-3">
                  <TextInput
                    placeholder="Confirme sua senha"
                    placeholderTextColor={colors.muted}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showPassword}
                    editable={!isLoading}
                    className="flex-1 text-foreground"
                  />
                  <Pressable
                    onPress={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    <MaterialIcons
                      name={showPassword ? "visibility" : "visibility-off"}
                      size={20}
                      color={colors.muted}
                    />
                  </Pressable>
                </View>
              </View>
            )}

            {/* Forgot Password Link (Login only) */}
            {!isSignUp && (
              <Pressable className="mb-6">
                <Text className="text-primary font-semibold text-right">
                  Esqueceu a senha?
                </Text>
              </Pressable>
            )}

            {/* Submit Button */}
            <Pressable
              onPress={isSignUp ? handleSignUp : handleLogin}
              disabled={isLoading}
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
              className="bg-primary px-6 py-4 rounded-lg items-center mb-4"
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text className="text-white font-bold text-lg">
                  {isSignUp ? "Criar Conta" : "Fazer Login"}
                </Text>
              )}
            </Pressable>

            {/* Demo Account Info */}
            {!isSignUp && (
              <View className="bg-surface rounded-lg p-4 border border-border">
                <Text className="text-xs text-muted mb-2 font-semibold">
                  CONTA DE DEMONSTRAÇÃO
                </Text>
                <Text className="text-sm text-foreground mb-1">
                  Email: demo@example.com
                </Text>
                <Text className="text-sm text-foreground">
                  Senha: demo123456
                </Text>
              </View>
            )}
          </View>

          {/* Footer */}
          <View className="px-6 py-4 border-t border-border">
            <Text className="text-xs text-muted text-center">
              Ao continuar, você concorda com nossos{" "}
              <Text className="text-primary font-semibold">Termos de Serviço</Text>
            </Text>
          </View>
        </ScrollView>
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
}
