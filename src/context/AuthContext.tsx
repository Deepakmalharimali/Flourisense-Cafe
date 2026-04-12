import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UserInfo {
  name: string;
  phone: string;
  userId?: string;
}

interface AuthContextType {
  user: UserInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (name: string, phone: string) => Promise<{ success: boolean; error?: string }>;
  verifyOtp: (phone: string, otp: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const stored = localStorage.getItem("flourisense_user_name");
        setUser({
          name: stored || "Guest",
          phone: session.user.phone || "",
          userId: session.user.id,
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const stored = localStorage.getItem("flourisense_user_name");
        setUser({
          name: stored || "Guest",
          phone: session.user.phone || "",
          userId: session.user.id,
        });
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (name: string, phone: string) => {
    try {
      // Format phone with country code if not present
      const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;
      localStorage.setItem("flourisense_user_name", name);
      localStorage.setItem("flourisense_user_phone", formattedPhone);

      const { error } = await supabase.auth.signInWithOtp({ phone: formattedPhone });
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || "Something went wrong" };
    }
  };

  const verifyOtp = async (phone: string, otp: string) => {
    try {
      const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;
      const { data, error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: otp,
        type: "sms",
      });
      if (error) return { success: false, error: error.message };

      const storedName = localStorage.getItem("flourisense_user_name") || "Guest";
      setUser({
        name: storedName,
        phone: formattedPhone,
        userId: data.user?.id,
      });
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || "Verification failed" };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("flourisense_user_name");
    localStorage.removeItem("flourisense_user_phone");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, verifyOtp, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
