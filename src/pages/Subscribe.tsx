import { useNavigate, Link } from "react-router-dom";
import { useAppStore } from "@/lib/store";
import { motion } from "framer-motion";
import { Check, Crown, Zap, ArrowLeft } from "lucide-react";

export default function SubscribePage() {
  const { currentUser, subscribe } = useAppStore();
  const navigate = useNavigate();

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-zinc-500">Please <Link to="/login" className="text-emerald-400 underline">log in</Link> first.</p>
      </div>
    );
  }

  const handleSubscribe = (plan: "monthly" | "yearly") => {
    subscribe(plan);
    navigate("/dashboard");
  };

  const features = ["Enter & track golf scores", "Monthly prize draw entry", "Choose your charity", "Personal dashboard", "Winner verification", "Email notifications"];

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-16">
      <div className="max-w-4xl w-full">
        <Link to="/" className="inline-flex items-center gap-1.5 text-zinc-600 text-sm mb-8 hover:text-zinc-400 transition-colors">
          <ArrowLeft size={14} /> Back
        </Link>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Choose your plan</h1>
          <p className="text-zinc-500 text-lg">Start playing, winning, and giving back</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center"><Zap size={22} className="text-emerald-400" /></div>
              <div><h2 className="text-lg font-bold text-white">Monthly</h2><p className="text-zinc-600 text-xs">Pay as you go</p></div>
            </div>
            <div className="mb-6"><span className="text-4xl font-black text-white">{"\u00A3"}9.99</span><span className="text-zinc-600">/month</span></div>
            <ul className="space-y-3 mb-8">
              {features.map((f) => (<li key={f} className="flex items-center gap-2.5 text-zinc-400 text-sm"><Check size={15} className="text-emerald-500 shrink-0" />{f}</li>))}
            </ul>
            <button onClick={() => handleSubscribe("monthly")}
              className="w-full py-2.5 rounded-xl border border-zinc-700 text-zinc-300 font-medium hover:bg-zinc-800 hover:border-zinc-600 transition-all">Start Monthly</button>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-zinc-900 border border-amber-500/30 rounded-2xl p-8 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-4 py-1 rounded-full">SAVE 17%</div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl bg-amber-500/10 flex items-center justify-center"><Crown size={22} className="text-amber-400" /></div>
              <div><h2 className="text-lg font-bold text-white">Yearly</h2><p className="text-zinc-600 text-xs">Best value</p></div>
            </div>
            <div className="mb-1"><span className="text-4xl font-black text-white">{"\u00A3"}99.99</span><span className="text-zinc-600">/year</span></div>
            <p className="text-sm text-amber-400/80 mb-6">{"\u00A3"}8.33/mo — save {"\u00A3"}19.89</p>
            <ul className="space-y-3 mb-8">
              {features.map((f) => (<li key={f} className="flex items-center gap-2.5 text-zinc-400 text-sm"><Check size={15} className="text-amber-500 shrink-0" />{f}</li>))}
            </ul>
            <button onClick={() => handleSubscribe("yearly")}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold hover:brightness-110 transition-all">Start Yearly</button>
          </motion.div>
        </div>

        <p className="text-center text-zinc-700 text-sm mt-10">Secure payment via Stripe. Cancel anytime.</p>
      </div>
    </div>
  );
}
