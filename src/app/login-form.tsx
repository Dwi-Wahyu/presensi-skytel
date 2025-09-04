"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoginFormValues, loginSchema } from "@/validations/schemas/auth";
import { toast } from "sonner";

import { signIn } from "next-auth/react";

import { useRouter } from "nextjs-toploader/app";
import { useState } from "react";
import { PasswordInput } from "@/components/password-input";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { getEmployeeByUsernameAction } from "./admin/karyawan/actions";
import { catatPresensi } from "./presensi/actions";
import GagalPresensi from "./presensi/gagal";
import SuksesPresensi from "./presensi/sukses";

export default function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);

    const res = await signIn("credentials", {
      username: data.username,
      password: data.password,
      redirect: false,
    });

    if (res?.error) {
      form.setError("username", {
        type: "manual",
        message: "Username atau Password salah",
      });
      form.setError("password", {
        type: "manual",
        message: "Username atau Password salah",
      });
    } else {
      toast.success("Login Sukses");

      const employeeAccount = await getEmployeeByUsernameAction(data.username);

      if (employeeAccount) {
        router.push("/home");
      } else {
        router.push("/admin");
      }
    }

    setLoading(false);
  };

  return (
    <div
      className={cn(
        "flex flex-col md:flex-row p-6 md:p-10 items-center min-h-screen md:justify-evenly gap-9 relative",
        className
      )}
      {...props}
    >
      <Image
        src="/login-logo.svg"
        alt="Image"
        className="md:scale-200"
        width={190}
        height={190}
      />

      <Card className="min-w-sm">
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Selamat Datang</h1>
                  <p className="text-muted-foreground text-balance">
                    Aplikasi Presensi Digital
                  </p>
                </div>
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          className="px-4 py-2"
                          placeholder="Username Anda"
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
                      <FormLabel>Kata Sandi</FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder="Kata Sandi Anda"
                          className="px-4 py-2"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col gap-2 items-center">
                  <Button
                    disabled={loading}
                    type="submit"
                    className="from-primary via-primary/50 to-primary py-5 md:py-2 text-md w-full bg-transparent bg-gradient-to-r [background-size:200%_auto] hover:bg-transparent hover:bg-[99%_center]"
                  >
                    {form.formState.isSubmitting ? "Loading..." : "Login"}
                  </Button>

                  <Button
                    type="button"
                    asChild
                    variant={"link"}
                    className="w-full"
                  >
                    <Link href={"/lupa-katasandi"}>Lupa Kata Sandi</Link>
                  </Button>
                </div>

                <h1 className="text-center hidden md:block text-muted-foreground text-xs">
                  Copyright @ PT SkytelIndo 2025
                </h1>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="w-full flex md:hidden justify-center">
        <h1 className="text-center text-muted-foreground text-xs">
          Copyright @ PT SkytelIndo 2025
        </h1>
      </div>
    </div>
  );
}
