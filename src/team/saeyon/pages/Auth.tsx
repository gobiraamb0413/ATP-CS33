import React, { useState, useEffect } from "react";
import { Zap, ArrowLeft, Sun, Moon, Github, ArrowRight, CircleCheck, Loader2 } from "lucide-react";
import { Button } from "@/team/sarukan/components/ui/Button";
import { Switch } from "@/team/sarukan/components/ui/Switch";
import { GridBackground } from "@/team/sarukan/components/ui/GridBackground";

export const Auth: React.FC = () => {
  const [isSignIn, setIsSignIn] = useState<boolean>(true);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved) return saved === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const handleOAuthLogin = (provider: string) => {
    setLoading(true);
    localStorage.setItem(
      "devconcord_session",
      JSON.stringify({
        email: `${provider.toLowerCase()}@devconcord.ai`,
        user_id: "00000000-0000-0000-0000-000000000001",
        display_name: `${provider} Operator`,
        role: "operator",
      })
    );
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    localStorage.setItem(
      "devconcord_session",
      JSON.stringify({
        email: email || "demo@devconcord.ai",
        user_id: "00000000-0000-0000-0000-000000000001",
        display_name: email.split("@")[0] || "Operator",
        role: "operator",
      })
    );
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 400);
  };

  return (
    <div className="min-h-screen flex text-foreground bg-background font-primarylw transition-colors duration-500">
      <div className="relative w-full lg:w-1/2 p-8 sm:p-12 lg:p-16 flex items-center justify-center border-r border-border/40 min-h-screen transition-colors duration-500">
        <GridBackground className="!absolute inset-0 opacity-40 pointer-events-none" gridSize={40} />

        <div className="absolute top-6 left-6 sm:left-12 flex items-center gap-4 z-20">
          <a
            href="/"
            className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to site</span>
          </a>
        </div>

        <div className="absolute top-6 right-6 sm:right-12 z-20 flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full border border-border bg-background/80 backdrop-blur-sm">
            <Moon className="h-3 w-3 text-muted-foreground" />
            <Switch checked={isDark} onCheckedChange={toggleTheme} size="sm" />
            <Sun className="h-3 w-3 text-muted-foreground" />
          </div>
        </div>

        <div className="relative z-10 w-full max-w-md space-y-6">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 mb-2">
              <div className="h-9 w-9 rounded-xl bg-foreground flex items-center justify-center shadow-lg shadow-primary/20">
                <Zap className="w-5 h-5 text-background" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-foreground">
                Dev<span className="text-muted-foreground font-normal ml-1">Concord</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              {isSignIn ? "Welcome back" : "Create your account"}
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm">
              {isSignIn
                ? "Sign in to access your autonomous AI data intelligence workspace."
                : "Start delivering explainable data intelligence 10× faster with DevConcord."}
            </p>
          </div>

          <div className="space-y-3">
            <Button
              variant="outline"
              type="button"
              onClick={() => handleOAuthLogin("Google")}
              className="w-full flex items-center justify-center gap-3 h-11 text-xs font-semibold rounded-full border border-zinc-300 dark:border-zinc-700 bg-white/90 dark:bg-zinc-900/90 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 shadow-sm"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Continue with Google
            </Button>

            <Button
              variant="outline"
              type="button"
              onClick={() => handleOAuthLogin("GitHub")}
              className="w-full flex items-center justify-center gap-3 h-11 text-xs font-semibold rounded-full border border-zinc-300 dark:border-zinc-700 bg-white/90 dark:bg-zinc-900/90 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 shadow-sm"
            >
              <Github className="h-4 w-4 text-zinc-900 dark:text-white" />
              Continue with GitHub
            </Button>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex-1 h-px bg-border/60" />
            <span className="font-mono text-[10px] uppercase tracking-wider">or continue with email</span>
            <div className="flex-1 h-px bg-border/60" />
          </div>

          {infoMessage && (
            <div className="p-3 text-xs rounded-xl bg-muted border border-border text-foreground">
              {infoMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Work Email</label>
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-11 px-3.5 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-foreground">Password</label>
                {isSignIn && (
                  <button
                    type="button"
                    onClick={() => setInfoMessage("Password reset link sent to your email address.")}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-11 px-3.5 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-full text-xs font-bold gap-2 shadow-lg"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <span>{isSignIn ? "Sign In to Workspace" : "Create Free Account"}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </Button>
          </form>

          <div className="pt-2 text-center text-xs text-muted-foreground">
            {isSignIn ? (
              <span>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setIsSignIn(false)}
                  className="text-foreground font-semibold hover:underline cursor-pointer"
                >
                  Sign Up
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setIsSignIn(true)}
                  className="text-foreground font-semibold hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              </span>
            )}
          </div>

          <p className="text-center text-[11px] text-muted-foreground/70 leading-relaxed">
            By continuing, you agree to DevConcord's Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>

      <div className="hidden lg:flex w-1/2 p-12 lg:p-16 flex-col justify-between relative bg-zinc-950 text-white overflow-hidden border-l border-zinc-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
              DevConcord Multi-Agent Engine v2.4
            </span>
          </div>
          <span className="text-xs font-mono text-zinc-500">PROD-CLUSTER-EU</span>
        </div>

        <div className="relative z-10 space-y-6 my-auto">
          <h2 className="text-3xl font-extrabold tracking-tight leading-tight">
            Autonomous data intelligence, from raw ingestion to executive-level findings.
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-lg">
            DevConcord coordinates 6 specialized agents to inspect schemas, engineer features, train high-accuracy models, and generate explainable intelligence.
          </p>

          <div className="space-y-3 pt-4">
            {[
              "LangGraph deterministic state machines with sub-second task recovery",
              "Native SHAP & LIME mathematical explainability on all predictions",
              "Enterprise VPC deployment with air-gapped data confidentiality",
              "Model Context Protocol (MCP) live schema inspection across Postgres & Snowflake",
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-xs text-zinc-300">
                <CircleCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <div className="pt-6">
            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 font-mono text-[11px] text-zinc-400 space-y-1">
              <div className="text-zinc-500">LangGraph Supervisor Dispatch Trace</div>
              <div>
                <span className="text-emerald-400">➜</span> [09:41:22 UTC]{" "}
                <span className="text-indigo-400">devconcord-agent</span>: schema validated (12 features)
              </div>
              <div>
                <span className="text-emerald-400">➜</span> [09:41:24 UTC]{" "}
                <span className="text-indigo-400">devconcord-agent</span>: LightGBM surrogate AUC: 0.942
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-zinc-500 font-mono flex items-center justify-between">
          <span>Enterprise VPC Encrypted</span>
          <span>99.99% Uptime SLA</span>
        </div>
      </div>
    </div>
  );
};

export default Auth;
