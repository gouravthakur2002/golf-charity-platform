import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppStore } from "@/lib/store";
import { motion } from "framer-motion";
import { Eye, EyeOff, LogIn, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAppStore();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      const ok = login(email, password);
      if (ok) {
        const u = useAppStore.getState().currentUser;
        navigate(u?.role === "admin" ? "/admin" : "/dashboard");
      } else {
        setError("Invalid email or password.");
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <Link to="/" className="inline-flex items-center gap-1.5 text-zinc-600 text-sm mb-8 hover:text-zinc-400 transition-colors">
          <ArrowLeft size={14} /> Back
        </Link>

        <div className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">G</span>
          </div>
          <span className="font-bold text-xl text-white">Golf<span className="text-emerald-400">Give</span></span>
        </div>

        <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
        <p className="text-zinc-500 text-sm mb-8">Log in to continue</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm outline-none focus:border-emerald-500 transition-colors placeholder:text-zinc-600" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5">Password</label>
            <div className="relative">
              <input type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" required
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm outline-none focus:border-emerald-500 transition-colors placeholder:text-zinc-600" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl">{error}</div>}

          <button type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold py-2.5 rounded-xl hover:brightness-110 transition-all disabled:opacity-50">
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><LogIn size={16} /> Log In</>}
          </button>
        </form>

        <p className="text-zinc-600 text-sm text-center mt-6">
          No account? <Link to="/signup" className="text-emerald-400 font-medium hover:text-emerald-300">Sign Up</Link>
        </p>

        <div className="mt-10 pt-6 border-t border-zinc-800">
          <p className="text-xs text-zinc-700 text-center mb-3 uppercase tracking-wider">Demo Accounts</p>
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={() => { setEmail("james@example.com"); setPassword("demo"); }}
              className="text-xs text-zinc-500 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:text-zinc-300 transition-all">Subscriber</button>
            <button type="button" onClick={() => { setEmail("admin@golfcharity.com"); setPassword("admin123"); }}
              className="text-xs text-zinc-500 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:text-zinc-300 transition-all">Admin</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
