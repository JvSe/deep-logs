"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthenticated } from "@/hooks/auth";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const router = useRouter();

  const signInMutate = useMutation({
    mutationFn: async () => {
      return (await axios.post("/api/auth/login", form)).data;
    },
    onSuccess: (data) => {
      console.log("Login realizado com sucesso");
      useAuthenticated.getState().setUser({ ...data.user });
      router.replace("/dashboard");
      toast.success("Login realizado com sucesso");
    },
    onError: (error: AxiosError) => {
      console.log("Erro ao realizar login", JSON.stringify(error));
      toast.error("Erro ao realizar login", {
        description: (error.response?.data as { error: string }).error,
      });
    },
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Bem-Vindo de volta!</CardTitle>
          <CardDescription>Faça login com seu email e senha</CardDescription>
        </CardHeader>
        <CardContent>
          {/* <form> */}
          <div className="grid gap-6">
            <div className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-3">
                {/* <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div> */}
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                />
              </div>
              <Button
                onClick={() => signInMutate.mutate()}
                type="button"
                loading={signInMutate.isPending}
                disabled={signInMutate.isPending}
                className="w-full"
              >
                Login
              </Button>
            </div>
            {/* <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="#" className="underline underline-offset-4">
                Sign up
              </a>
            </div> */}
          </div>
          {/* </form> */}
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
