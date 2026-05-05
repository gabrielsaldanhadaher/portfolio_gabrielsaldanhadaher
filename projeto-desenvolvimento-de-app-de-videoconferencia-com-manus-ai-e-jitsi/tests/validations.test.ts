import { describe, it, expect } from "vitest";
import {
  LoginSchema,
  SignUpSchema,
  CreateCommunitySchema,
  validate,
} from "@/lib/validations";

describe("Validações", () => {
  describe("LoginSchema", () => {
    it("deve validar email e senha válidos", () => {
      const data = { email: "test@example.com", password: "password123" };
      const result = LoginSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("deve rejeitar email inválido", () => {
      const data = { email: "invalid-email", password: "password123" };
      const result = LoginSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("deve rejeitar senha curta", () => {
      const data = { email: "test@example.com", password: "123" };
      const result = LoginSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe("SignUpSchema", () => {
    it("deve validar dados de cadastro válidos", () => {
      const data = {
        name: "João Silva",
        email: "joao@example.com",
        password: "password123",
        confirmPassword: "password123",
      };
      const result = SignUpSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("deve rejeitar senhas diferentes", () => {
      const data = {
        name: "João Silva",
        email: "joao@example.com",
        password: "password123",
        confirmPassword: "different",
      };
      const result = SignUpSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("deve rejeitar nome muito curto", () => {
      const data = {
        name: "J",
        email: "joao@example.com",
        password: "password123",
        confirmPassword: "password123",
      };
      const result = SignUpSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe("CreateCommunitySchema", () => {
    it("deve validar comunidade válida", () => {
      const data = {
        name: "Meu Projeto React",
        description: "Comunidade de React",
        categoryId: 1,
        isPrivate: false,
      };
      const result = CreateCommunitySchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("deve rejeitar nome muito curto", () => {
      const data = {
        name: "AB",
        description: "Comunidade de React",
        categoryId: 1,
        isPrivate: false,
      };
      const result = CreateCommunitySchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("deve rejeitar categoryId inválido", () => {
      const data = {
        name: "Meu Projeto React",
        description: "Comunidade de React",
        categoryId: -1,
        isPrivate: false,
      };
      const result = CreateCommunitySchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe("validate() helper", () => {
    it("deve retornar sucesso com dados válidos", () => {
      const result = validate(LoginSchema, {
        email: "test@example.com",
        password: "password123",
      });
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });

    it("deve retornar erro com dados inválidos", () => {
      const result = validate(LoginSchema, {
        email: "invalid",
        password: "123",
      });
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});
