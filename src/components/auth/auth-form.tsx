"use client";

import { useSignIn, useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";
import LoadingSpinner from "../global/loading-spinner";
import { Icons } from "../ui/icons";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  action: "sign-in" | "sign-up";
}

export default function AuthForm({
  className,
  action,
  ...props
}: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { signIn, setActive: setActiveSignIn } = useSignIn();
  const { signUp, setActive: setActiveSignUp } = useSignUp();

  async function signInWithCredentials(event: React.SyntheticEvent) {
    event.preventDefault();
    try {
      setIsLoading(true);

      const email = emailRef.current?.value;
      const password = passwordRef.current?.value;
      const name = nameRef.current?.value;

      if (action === "sign-in" && !!signIn) {
        if (!email || !password) throw new Error("Missing email or password");

        const { status, createdSessionId } = await signIn.create({
          identifier: email,
          password,
        });

        if (status === "complete") {
          await setActiveSignIn({ session: createdSessionId });
        } else {
          throw new Error("Something went wrong.");
        }
      }

      if (action === "sign-up" && !!signUp) {
        if (!email || !password || !name)
          throw new Error("Missing email, password, or name");

        const firstName = name.split(" ")[0];
        const lastName = name.split(" ")[1];

        if (!firstName || !lastName)
          throw new Error("Missing first name or last name");

        const { status, createdSessionId } = await signUp.create({
          emailAddress: email,
          password,
          firstName,
          lastName,
        });

        if (status === "complete") {
          await setActiveSignUp({ session: createdSessionId });
        } else {
          throw new Error("Something went wrong.");
        }
      }

      router.push("/dashboard");
    } catch (e) {
      const error = e as Error;
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function signInWithGoogle() {
    setIsLoading(true);
    try {
      if (!signIn) throw new Error("Missing signIn object");
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/auth/callback",
        redirectUrlComplete: "/dashboard",
      });
    } catch (e) {
      const error = e as Error;
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  function handleGoogleSignIn() {
    signInWithGoogle().catch(console.error);
  }

  function onSubmit(event: React.SyntheticEvent) {
    signInWithCredentials(event).catch(console.error);
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          {action === "sign-up" && (
            <>
              <div className="grid gap-1">
                <Label className="sr-only" htmlFor="name">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Your name"
                  type="text"
                  autoComplete="name"
                  autoCorrect="off"
                  disabled={isLoading}
                  ref={nameRef}
                />
              </div>
            </>
          )}
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              name="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              ref={emailRef}
            />
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              placeholder="Password"
              type="password"
              autoComplete="current-password"
              autoCorrect="off"
              disabled={isLoading}
              ref={passwordRef}
            />
          </div>
          <Button disabled={isLoading}>
            {isLoading && <LoadingSpinner />}
            {action === "sign-in" ? "Sign In with Email" : "Sign Up with Email"}
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button
        variant="outline"
        type="button"
        disabled={isLoading}
        onClick={handleGoogleSignIn}
      >
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}{" "}
        Google
      </Button>
    </div>
  );
}
