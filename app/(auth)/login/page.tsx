import LoginForm from "@/module/auth/components/login-form";
import { requireNoAuth } from "@/module/auth/utils/auth-utils";

const LoginPage = async () => {
  await requireNoAuth();
  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <LoginForm />
    </main>
  );
};

export default LoginPage;
