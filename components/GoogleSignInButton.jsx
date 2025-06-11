import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { useUserStore } from "@/store/useUserStore";

const GoogleSignInButton = ({ onClick }) => {
  const { signInWithGoogle, loading } = useUserStore();

  const handleSignIn = async () => {
    const result = await signInWithGoogle();
    if (result.success && onClick) {
      onClick(result.user);
    }
  };

  return (
    <motion.button
      onClick={handleSignIn}
      disabled={loading}
      className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-white hover:bg-gray-50 text-slate-800 font-medium rounded-xl transition-all border border-gray-200 shadow-lg hover:shadow-xl relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
      whileHover={{ scale: loading ? 1 : 1.02 }}
      whileTap={{ scale: loading ? 1 : 0.98 }}
    >
      <span className="absolute -top-10 -left-10 h-20 w-20 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-full blur-xl group-hover:scale-150 transition-all duration-700 ease-in-out"></span>
      <span className="absolute -bottom-10 -right-10 h-20 w-20 bg-gradient-to-br from-red-500/20 to-yellow-500/20 rounded-full blur-xl group-hover:scale-150 transition-all duration-700 ease-in-out"></span>
      <FcGoogle className="relative z-10 text-xl text-red-500" />
      <span className="relative z-10 font-medium">
        {loading ? "Signing in..." : "Sign in with Google"}
      </span>
    </motion.button>
  );
};

export default GoogleSignInButton;
