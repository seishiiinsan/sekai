"use client";

import { useActionState } from "react";
import Link from "next/link";
import { forgotPasswordAction, type AuthFormState } from "@/app/(auth)/actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "./submit-button";
import { FieldError } from "./field-error";

export function ForgotPasswordForm() {
  const [state, action] = useActionState<AuthFormState, FormData>(forgotPasswordAction, {});

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mot de passe oublié</CardTitle>
        <CardDescription>On t&apos;envoie un lien pour le réinitialiser.</CardDescription>
      </CardHeader>
      <CardContent>
        {state.success ? (
          <p className="rounded-md border border-primary/30 bg-primary/10 px-3 py-2 text-sm">
            {state.success}
          </p>
        ) : (
          <form action={action} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" autoComplete="email" required />
              <FieldError message={state.fieldErrors?.email} />
            </div>
            <SubmitButton className="w-full">Envoyer le lien</SubmitButton>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
            Retour à la connexion
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
