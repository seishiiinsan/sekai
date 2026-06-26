"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { signUpAction, type AuthFormState } from "@/app/(auth)/actions";
import { AVATARS, DEFAULT_AVATAR } from "@/lib/avatars";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { SubmitButton } from "./submit-button";
import { FieldError, FormError } from "./field-error";
import { TurnstileWidget } from "./turnstile-widget";

export function SignupForm() {
  const [state, action] = useActionState<AuthFormState, FormData>(signUpAction, {});
  const [avatar, setAvatar] = useState<string>(DEFAULT_AVATAR);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Créer un compte</CardTitle>
        <CardDescription>Dix secondes, et tu joues. Pas de confirmation par email.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <FormError message={state.error} />

          <div className="space-y-2">
            <Label>Avatar</Label>
            <input type="hidden" name="avatar" value={avatar} />
            <div className="grid grid-cols-6 gap-2" role="radiogroup" aria-label="Choisir un avatar">
              {AVATARS.map((a) => (
                <button
                  key={a.key}
                  type="button"
                  role="radio"
                  aria-checked={avatar === a.key}
                  aria-label={a.label}
                  title={a.label}
                  onClick={() => setAvatar(a.key)}
                  className={cn(
                    "flex aspect-square items-center justify-center rounded-md border text-lg transition-colors",
                    avatar === a.key
                      ? "border-primary bg-primary/10 ring-1 ring-primary"
                      : "border-border hover:bg-accent",
                  )}
                >
                  <span aria-hidden>{a.emoji}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Pseudo public</Label>
            <Input
              id="username"
              name="username"
              autoComplete="username"
              placeholder="explorateur42"
              required
            />
            <FieldError message={state.fieldErrors?.username} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" autoComplete="email" required />
            <FieldError message={state.fieldErrors?.email} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
            />
            <FieldError message={state.fieldErrors?.password} />
          </div>

          <TurnstileWidget />

          <SubmitButton className="w-full">Créer mon compte</SubmitButton>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Déjà inscrit ?{" "}
          <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
            Connecte-toi
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
