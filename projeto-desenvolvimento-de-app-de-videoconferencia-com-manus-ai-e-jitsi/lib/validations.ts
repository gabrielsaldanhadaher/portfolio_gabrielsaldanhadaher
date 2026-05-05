import { z } from "zod";

/**
 * Schemas de validação centralizados
 * Utilizados tanto no cliente quanto no servidor
 */

// Auth
export const LoginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export const SignUpSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(255),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não correspondem",
  path: ["confirmPassword"],
});

// Community
export const CreateCommunitySchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres").max(255),
  description: z.string().max(1000, "Descrição muito longa"),
  categoryId: z.number().positive("Categoria inválida"),
  isPrivate: z.boolean().default(false),
});

export const UpdateCommunitySchema = CreateCommunitySchema.partial();

// Member
export const AddMemberSchema = z.object({
  userId: z.number().positive("Usuário inválido"),
  communityId: z.number().positive("Comunidade inválida"),
});

// Meeting
export const CreateMeetingSchema = z.object({
  communityId: z.number().positive("Comunidade inválida"),
  title: z.string().min(1, "Título obrigatório").max(255),
});

// Types
export type LoginInput = z.infer<typeof LoginSchema>;
export type SignUpInput = z.infer<typeof SignUpSchema>;
export type CreateCommunityInput = z.infer<typeof CreateCommunitySchema>;
export type UpdateCommunityInput = z.infer<typeof UpdateCommunitySchema>;
export type AddMemberInput = z.infer<typeof AddMemberSchema>;
export type CreateMeetingInput = z.infer<typeof CreateMeetingSchema>;

/**
 * Função auxiliar para validar dados
 */
export function validate<T>(schema: z.ZodSchema, data: unknown): { success: boolean; data?: T; error?: string } {
  try {
    const result = schema.parse(data);
    return { success: true, data: result as T };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message = error.issues.map((issue: any) => issue.message).join(", ");
      return { success: false, error: message };
    }
    return { success: false, error: "Erro de validação" };
  }
}
