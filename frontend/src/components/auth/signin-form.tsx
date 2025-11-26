import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router";

const SignInSchema = z.object({
  username: z.string().min(3, "Tên đăng nhập có ít nhất 3 ký tự"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});
type SignInFormValues = z.infer<typeof SignInSchema>;
export function SignInForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { signIn } = useAuthStore();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(SignInSchema),
  });
  const onSubmit = async (data: SignInFormValues) => {
    const { username, password } = data;
    await signIn(username, password);
    navigate("/");
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 border-[hsl(var(--border-soft-blue))]">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Đăng nhập</h1>
                <p className="text-muted-foreground text-sm text-balance">
                  Nhập tài khoản của bạn bên dưới để Đăng nhập
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="username">Tên đăng nhập</FieldLabel>
                <Input
                  className="rounded-[0.4rem] border-[hsl(var(--border-soft-blue))]"
                  id="username"
                  type="text"
                  {...register("username")}
                />
                {errors.username && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.username.message}
                  </p>
                )}
              </Field>
              <Field>
                <Field>
                  <FieldLabel htmlFor="password">Mật khẩu</FieldLabel>
                  <Input
                    className="rounded-[0.4rem] border-[hsl(var(--border-soft-blue))]"
                    id="password"
                    type="password"
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </Field>
              </Field>
              <Field>
                <Button type="submit" className="rounded-[0.4rem]">
                  Đăng nhập
                </Button>
              </Field>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/sign-in.jpg"
              alt="Image"
              className="absolute top-1/2 -translate-y-1/2 object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        Chưa có tài khoản <a href="/signup">đăng ký</a>
      </FieldDescription>
    </div>
  );
}
