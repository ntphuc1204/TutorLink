import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router";

const SignUpSchema = z.object({
  firstName: z.string().min(1, "Tên bắt buộc phải có"),
  lastName: z.string().min(1, "Họ bắt buộc phải có"),
  username: z.string().min(3, "Tên đăng nhập có ít nhất 3 ký tự"),
  email: z.email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  role: z.enum(["student", "teacher", "admin"], {
    message: "Vui lòng chọn vai trò",
  }),
});

type SignUpFormValues = z.infer<typeof SignUpSchema>;

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { signUp } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(SignUpSchema),
  });

  const onSubmit = async (data: SignUpFormValues) => {
    const { firstName, lastName, username, email, password, role } = data;
    await signUp(username, password, email, firstName, lastName, role);
    navigate("/signin");
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 border-[hsl(var(--border-soft-blue))]">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Tạo Tài khoản mới</h1>
                <p className="text-muted-foreground text-sm text-balance">
                  Nhập email của bạn bên dưới để tạo tài khoản
                </p>
              </div>
              <div className="flex gap-2">
                <Field>
                  <FieldLabel htmlFor="lastName">Tên</FieldLabel>
                  <Input
                    className="rounded-[0.4rem] border-[hsl(var(--border-soft-blue))]"
                    id="lastName"
                    type="text"
                    placeholder=""
                    {...register("lastName")}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.lastName.message}
                    </p>
                  )}
                </Field>
                <Field>
                  <FieldLabel htmlFor="firstName">Họ</FieldLabel>
                  <Input
                    className="rounded-[0.4rem] border-[hsl(var(--border-soft-blue))]"
                    id="firstName"
                    type="text"
                    placeholder=""
                    {...register("firstName")}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.firstName.message}
                    </p>
                  )}
                </Field>
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
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  className="rounded-[0.4rem] border-[hsl(var(--border-soft-blue))]"
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </Field>

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

              {/* ROLE FIELD */}
              <Field>
                <FieldLabel>Vai trò</FieldLabel>
                <select
                  className="border-[hsl(var(--border-soft-blue))] rounded-[0.4rem] rounded-md px-2 h-9"
                  {...register("role")}
                >
                  <option value="">-- Chọn vai trò --</option>
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>

                {errors.role && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.role.message}
                  </p>
                )}
              </Field>

              <Field>
                <Button type="submit" className="rounded-[0.4rem]">
                  Tạo Tài Khoản
                </Button>
              </Field>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/sign-up.png"
              alt="sign up"
              className="absolute top-1/2 -translate-y-1/2 object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        Bằng cách tiếp tục bạn đồng ý với <a href="#">điều khoản dịch vụ</a> và{" "}
        <a href="#">chính sách bảo mật</a> của chúng tôi.
      </FieldDescription>
      <FieldDescription className="px-6 text-center">
        quay lại <a href="/signin">đăng nhập</a>
      </FieldDescription>
    </div>
  );
}
