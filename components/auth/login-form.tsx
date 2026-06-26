"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signInAction, type AuthFormState } from "@/app/(auth)/actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "./submit-button";
import { FieldError, FormError } from "./field-error";

export function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const [state, action] = useActionState<AuthFormState, FormData>(signInAction, {});

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connexion</CardTitle>
        <CardDescription>Content de te revoir. Reprends ta progression.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          {redirectTo && <input type="hidden" name="redirect" value={redirectTo} />}
          <FormError message={state.error} />

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" autoComplete="email" required />
            <FieldError message={state.fieldErrors?.email} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Mot de passe</Label>
              <Link
                href="/forgot-password"
                className="text-xs text-muted-foreground underline-offset-4 hover:underline"
              >
                Oublié ?
              </Link>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
            <FieldError message={state.fieldErrors?.password} />
          </div>

          <SubmitButton className="w-full">Se connecter</SubmitButton>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Pas encore de compte ?{" "}
          <Link href="/signup" className="font-medium text-primary underline-offset-4 hover:underline">
            Crée-en un
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
