"use client";

import { signIn } from "@/lib/auth-client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Github,
  Eye,
  GitPullRequest,
  Star,
  CheckCircle2,
  ArrowRight,
  Command,
} from "lucide-react";

const LoginForm = () => {
  const [isGithubLoading, setIsGithubLoading] = useState(false);

  const handleGithubLogin = async () => {
    setIsGithubLoading(true);
    try {
      await signIn.social({
        provider: "github",
      });
    } catch (error) {
      console.error("GitHub login failed:", error);
    } finally {
      setIsGithubLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-background selection:bg-primary/30">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-card flex-col justify-between p-12 text-card-foreground">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/20">
              <Eye className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">CodeHawk</span>
          </div>

          <h1 className="text-5xl font-bold tracking-tight mb-6 leading-[1.1]">
            Code reviews, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
              reimagined by AI.
            </span>
          </h1>
          <p className="text-lg text-slate-400 max-w-md mb-10 leading-relaxed">
            Elevate your code quality with intelligent insights. Instant
            feedback on bugs, security, and best practices directly in your PRs.
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4 group">
              <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/50 text-primary transition-colors group-hover:border-primary/50 group-hover:bg-primary/10">
                <GitPullRequest className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-medium text-card-foreground">
                  Instant PR Analysis
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Automated reviews the moment you push code.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/50 text-blue-400 transition-colors group-hover:border-blue-500/50 group-hover:bg-blue-500/10">
                <Star className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-medium text-card-foreground">
                  Smart Suggestions
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Context-aware refactoring and security tips.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/50 text-emerald-400 transition-colors group-hover:border-emerald-500/50 group-hover:bg-emerald-500/10">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-medium text-card-foreground">
                  Production Ready
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Trusted by developers to ship cleaner code faster.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-8 w-8 rounded-full border-2 border-card bg-muted"
              />
            ))}
          </div>
          <p>Joined by 10,000+ developers</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(var(--muted)_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-50 pointer-events-none" />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[100px] rounded-full pointer-events-none" />

        <div className="w-full max-w-[400px] relative z-10 space-y-8">
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <Eye className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold text-foreground">CodeHawk</span>
          </div>

          <Card className="border border-border/40 bg-card/80 backdrop-blur-xl shadow-xl">
            <CardHeader className="space-y-1 pb-6 text-center pt-8">
              <div className="mx-auto w-12 h-12 bg-muted rounded-2xl flex items-center justify-center mb-4 border border-border">
                <Command className="w-6 h-6 text-muted-foreground" />
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight text-card-foreground">
                Welcome back
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground">
                Login to access your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pb-8">
              <Button
                onClick={handleGithubLogin}
                disabled={isGithubLoading}
                className="w-full h-12 bg-foreground hover:bg-foreground/90 text-background transition-all duration-300 relative overflow-hidden group shadow-lg ring-1 ring-inset ring-border/20"
              >
                {isGithubLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-background/30 border-t-background" />
                    <span>Connecting...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3 w-full">
                    <Github className="h-5 w-5" />
                    <span className="font-medium">Continue with GitHub</span>
                    <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 ml-auto" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
              </Button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card/80 px-3 text-muted-foreground backdrop-blur-sm">
                    Protected by CodeHawk
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <a
              href="#"
              className="font-medium text-foreground hover:underline underline-offset-4 transition-colors"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="font-medium text-foreground hover:underline underline-offset-4 transition-colors"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
