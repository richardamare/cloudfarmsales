"use client";

import { useSignIn, useSignUp } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";
import LoadingSpinner from "~/components/global/loading-spinner";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Icons } from "~/components/ui/icons";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";

const formSchema = z.object({
  name: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(8),
});

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  action: "sign-in" | "sign-up";
}

export default function AuthForm({
  className,
  action,
  ...props
}: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const router = useRouter();

  const { signIn, setActive: setActiveSignIn } = useSignIn();
  const { signUp, setActive: setActiveSignUp } = useSignUp();

  function onSubmit(values: z.infer<typeof formSchema>) {
    signInWithEmail(values).catch(toast.error);
  }

  async function signInWithEmail(values: z.infer<typeof formSchema>) {
    console.log(values);
    try {
      setIsLoading(true);

      const { name, email, password } = values;

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
      throw new Error(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function signInWithGoogle() {
    try {
      setIsLoading(true);
      if (!signIn) throw new Error("Missing signIn object");
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/auth/callback",
        redirectUrlComplete: "/dashboard",
      });
    } catch (e) {
      console.log(e);
      const error = e as Error;
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  function handleGoogleSignIn() {
    signInWithGoogle().catch(console.error);
  }

  return (
    <>
      <Form {...form}>
        <div className={cn("grid gap-6", className)} {...props}>
          <form
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onSubmit={form.handleSubmit(onSubmit)}
            id="auth-form"
          >
            <div className="grid gap-2">
              {action === "sign-up" && (
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder=""
                        type="email"
                        autoComplete="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder=""
                        type="password"
                        autoComplete="current-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={isLoading}>
                {isLoading && <LoadingSpinner />}
                {action === "sign-in"
                  ? "Sign In with Email"
                  : "Sign Up with Email"}
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
              <LoadingSpinner />
            ) : (
              <Icons.google className="mr-2 h-4 w-4" />
            )}{" "}
            Google
          </Button>
        </div>
      </Form>
    </>
  );
}
