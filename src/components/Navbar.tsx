import { Link } from "react-router-dom";
import { useAppStore } from "@/lib/store";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  const { currentUser, logout } = useAppStore();
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">G</span>
          </div>
          <span className="font-bold text-lg text-white">Golf<span className="text-emerald-400">Give</span></span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link to="/charities" className="text-sm text-zinc-400 hover:text-white transition-colors">Charities</Link>
          <a href="#how-it-works" className="text-sm text-zinc-400 hover:text-white transition-colors">How It Works</a>
          {currentUser ? (
            <>
              <Link to={currentUser.role === "admin" ? "/admin" : "/dashboard"} className="text-sm text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5">
                <LayoutDashboard size={14} /> Dashboard
              </Link>
              <div className="h-5 w-px bg-zinc-800" />
              <span className="text-sm text-zinc-500">{currentUser.name}</span>
              <button onClick={logout} className="text-zinc-500 hover:text-white transition-colors"><LogOut size={16} /></button>
            </>
          ) : (
            <>
              <div className="h-5 w-px bg-zinc-800" />
              <Link to="/login" className="text-sm text-zinc-400 hover:text-white transition-colors">Log In</Link>
              <Link to="/signup" className="text-sm font-semibold bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-5 py-2 rounded-lg hover:brightness-110 transition-all">Get Started</Link>
            </>
          )}
        </div>

        <button className="md:hidden text-zinc-400" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="md:hidden border-t border-zinc-800/50 bg-zinc-950/95 backdrop-blur-xl">
            <div className="px-5 py-4 flex flex-col gap-3">
              <Link to="/charities" onClick={() => setOpen(false)} className="text-sm text-zinc-400 py-2">Charities</Link>
              <a href="#how-it-works" onClick={() => setOpen(false)} className="text-sm text-zinc-400 py-2">How It Works</a>
              {currentUser ? (
                <>
                  <Link to={currentUser.role === "admin" ? "/admin" : "/dashboard"} onClick={() => setOpen(false)} className="text-sm text-zinc-400 py-2">Dashboard</Link>
                  <button onClick={() => { logout(); setOpen(false); }} className="text-sm text-zinc-400 py-2 text-left">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setOpen(false)} className="text-sm text-zinc-400 py-2">Log In</Link>
                  <Link to="/signup" onClick={() => setOpen(false)} className="text-sm font-semibold bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-5 py-2.5 rounded-lg text-center">Get Started</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
