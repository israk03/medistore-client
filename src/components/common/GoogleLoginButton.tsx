
"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/services/auth.service";
import { toast } from "sonner";

declare global {
  interface Window {
    google: any;
  }
}

interface GoogleLoginButtonProps {
  label?: string;
}

export function GoogleLoginButton({
  label = "Continue with Google",
}: GoogleLoginButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const { login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const initGoogle = () => {
      if (!window.google || !buttonRef.current) return;

      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        callback: async (response: { credential: string }) => {
          try {
            // response.credential is the ID token — correct for verifyIdToken
            const res = await authService.googleLogin(response.credential);

            if (!res?.success || !res.data) {
              toast.error(res?.message || "Google login failed");
              return;
            }

            const { user, token } = res.data;
            login(user, token);
            toast.success(`Welcome, ${user.name.split(" ")[0]}!`);

            const destination =
              user.role === "ADMIN"
                ? "/admin/dashboard"
                : user.role === "SELLER"
                ? "/seller/dashboard"
                : "/customer/dashboard";

            router.push(destination);
          } catch (err: any) {
            toast.error(err?.message || "Google login failed");
          }
        },
      });

      // Render the actual Google button into our div
      window.google.accounts.id.renderButton(buttonRef.current, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "rectangular",
        logo_alignment: "left",
        width: buttonRef.current.offsetWidth,
      });
    };

    // Google script might already be loaded or still loading
    if (window.google) {
      initGoogle();
    } else {
      // Poll until script is ready
      const interval = setInterval(() => {
        if (window.google) {
          clearInterval(interval);
          initGoogle();
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [login, router]);

  return (
    <div className="w-full">
      {/* Google renders its own button UI inside this div */}
      <div
        ref={buttonRef}
        className="w-full flex justify-center"
        style={{ minHeight: 44 }}
      />
    </div>
  );
}