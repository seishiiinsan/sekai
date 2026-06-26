import { z } from "zod";
import { AVATAR_KEYS, DEFAULT_AVATAR } from "@/lib/avatars";

export const usernameSchema = z
  .string()
  .trim()
  .min(3, "Le pseudo doit faire au moins 3 caractères.")
  .max(20, "Le pseudo ne peut pas dépasser 20 caractères.")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "Lettres, chiffres et underscore uniquement (pas d'espaces).",
  );

export const emailSchema = z
  .string()
  .trim()
  .email("Adresse email invalide.");

export const passwordSchema = z
  .string()
  .min(8, "Le mot de passe doit faire au moins 8 caractères.")
  .max(72, "Le mot de passe est trop long.");

export const signUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  username: usernameSchema,
  avatar: z.enum(AVATAR_KEYS as [string, ...string[]]).default(DEFAULT_AVATAR),
});

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Mot de passe requis."),
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  password: passwordSchema,
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
