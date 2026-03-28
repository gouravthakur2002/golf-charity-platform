import { useState } from "react";
import Navbar from "@/components/Navbar";
import { useAppStore } from "@/lib/store";
import { motion } from "framer-motion";
import { Search, Heart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function CharitiesPage() {
  const { charities } = useAppStore();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const categories = ["All", ...Array.from(new Set(charities.map((c) => c.category)))];
  const filtered = charities.filter((c) => {
    const s = c.name.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase());
    return s && (category === "All" || c.category === category);
  });

  return (
    <main>
      <Navbar />
      <div className="pt-28 pb-16 text-center max-w-6xl mx-auto px-5 sm:px-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-rose-400 text-sm font-semibold tracking-wider uppercase mb-3">Our Charities</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Support a cause you believe in</h1>
          <p className="text-zinc-500 text-lg max-w-2xl mx-auto">Every subscription directly supports real change.</p>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-5 sm:px-8 pb-20">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600" />
            <input type="text" placeholder="Search charities..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm outline-none focus:border-emerald-500 transition-colors placeholder:text-zinc-600" />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setCategory(cat)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${category === cat ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-zinc-900 text-zinc-500 border border-zinc-800 hover:border-zinc-700"}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-colors group">
              <div className="flex items-start justify-between mb-4">
                <span className="text-3xl">{c.image}</span>
                {c.featured && <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full flex items-center gap-1"><Heart size={8} fill="currentColor" /> FEATURED</span>}
              </div>
              <span className="text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">{c.category}</span>
              <h3 className="text-lg font-bold text-white mt-3 mb-2">{c.name}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed mb-5 line-clamp-3">{c.description}</p>
              <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                <div>
                  <span className="text-xs text-zinc-600">Total Raised</span>
                  <p className="text-lg font-bold text-emerald-400">{"\u00A3"}{c.totalRaised.toLocaleString()}</p>
                </div>
                <Link to="/signup" className="text-sm text-emerald-400 font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Support <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
        {filtered.length === 0 && <div className="text-center py-20"><Heart size={36} className="mx-auto mb-3 text-zinc-800" /><p className="text-zinc-600">No charities found.</p></div>}
      </div>
    </main>
  );
}
