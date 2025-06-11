"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminStore } from "@/store/useAdminStore";

export default function AdminIndex() {
  const router = useRouter();
  const { validateAdminSession } = useAdminStore();

  useEffect(() => {
    const checkAuth = async () => {
      const isValid = await validateAdminSession();
      if (isValid) {
        router.push("/admin/dashboard");
      } else {
        router.push("/admin/login");
      }
    };
    
    checkAuth();
  }, [router, validateAdminSession]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="text-white text-center">
        <div className="mb-4">Redirecting...</div>
        <div className="w-16 h-16 border-t-4 border-b-4 border-indigo-500 rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  );
}
