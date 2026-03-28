import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppStore } from "@/lib/store";
import { motion } from "framer-motion";
import { Users, Trophy, Heart, Shield, LogOut, Play, Send, Check, DollarSign, BarChart3, Plus, Trash2, CreditCard } from "lucide-react";

type Tab = "overview" | "users" | "draws" | "charities" | "winners";

export default function AdminPage() {
  const navigate = useNavigate();
  const { currentUser, users, draws, charities, prizePool, jackpotRollover, logout, runDraw, publishDraw, verifyWinner, markPaid, addCharity, deleteCharity } = useAppStore();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [charityName, setCharityName] = useState("");
  const [charityDesc, setCharityDesc] = useState("");
  const [charityCat, setCharityCat] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [sim, setSim] = useState<ReturnType<typeof runDraw> | null>(null);

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center px-5">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-10 max-w-md text-center">
          <Shield size={36} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-zinc-500 text-sm mb-6">Admin privileges required.</p>
          <Link to="/login" className="inline-block bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold px-6 py-2.5 rounded-xl">Login as Admin</Link>
        </div>
      </div>
    );
  }

  const active = users.filter((u) => u.subscription.status === "active");
  const totalCharity = active.reduce((a, u) => a + ((u.subscription.plan === "yearly" ? 99.99 : 9.99) * u.charityPercentage) / 100, 0);
  const allWinners = draws.flatMap((d) => d.winners.map((w) => ({ ...w, drawId: d.id, drawMonth: d.month })));
  const inputClass = "w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm outline-none focus:border-emerald-500 transition-colors placeholder:text-zinc-600";
  const badge = (status: string) => status === "active" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-zinc-800 text-zinc-500 border border-zinc-700";

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center"><span className="text-white font-bold text-sm">G</span></div>
              <span className="font-bold text-lg text-white">Golf<span className="text-emerald-400">Give</span></span>
            </Link>
            <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">ADMIN</span>
          </div>
          <button onClick={() => { logout(); navigate("/"); }} className="flex items-center gap-1.5 text-zinc-600 hover:text-white text-sm transition-colors"><LogOut size={15} /> Logout</button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8">
        <div className="flex gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-xl mb-8 overflow-x-auto">
          {([
            { id: "overview", label: "Overview", icon: <BarChart3 size={15} /> },
            { id: "users", label: "Users", icon: <Users size={15} /> },
            { id: "draws", label: "Draws", icon: <Trophy size={15} /> },
            { id: "charities", label: "Charities", icon: <Heart size={15} /> },
            { id: "winners", label: "Winners", icon: <DollarSign size={15} /> },
          ] as const).map((t) => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === t.id ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"}`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }}>

          {activeTab === "overview" && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Dashboard Overview</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "Total Users", value: users.length, icon: <Users size={16} />, color: "text-emerald-400 bg-emerald-500/10" },
                  { label: "Active Subs", value: active.length, icon: <CreditCard size={16} />, color: "text-sky-400 bg-sky-500/10" },
                  { label: "Prize Pool", value: `\u00A3${prizePool.toLocaleString()}`, icon: <Trophy size={16} />, color: "text-amber-400 bg-amber-500/10" },
                  { label: "Charity Total", value: `\u00A3${totalCharity.toFixed(0)}`, icon: <Heart size={16} />, color: "text-rose-400 bg-rose-500/10" },
                ].map((s) => (
                  <div key={s.label} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-3"><div className={`w-8 h-8 rounded-lg ${s.color} flex items-center justify-center`}>{s.icon}</div><span className="text-xs text-zinc-600">{s.label}</span></div>
                    <p className="text-2xl font-bold text-white">{s.value}</p>
                  </div>
                ))}
              </div>
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center">
                  <h3 className="font-bold text-white mb-4 text-left">Jackpot</h3>
                  <p className="text-5xl font-black bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent py-4">{"\u00A3"}{(prizePool * 0.4 + jackpotRollover).toLocaleString()}</p>
                  <p className="text-zinc-600 text-sm">40% pool + {"\u00A3"}{jackpotRollover} rollover</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                  <h3 className="font-bold text-white mb-4">Draw Stats</h3>
                  <div className="space-y-3">
                    {[{ l: "Total Draws", v: draws.length }, { l: "Published", v: draws.filter((d) => d.status === "published").length }, { l: "Pending", v: draws.filter((d) => d.status === "pending").length }, { l: "Winners", v: allWinners.length }].map((i) => (
                      <div key={i.l} className="flex justify-between"><span className="text-zinc-500 text-sm">{i.l}</span><span className="font-semibold text-white">{i.v}</span></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">User Management</h2>
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead><tr className="border-b border-zinc-800">
                    {["User", "Plan", "Status", "Scores", "Charity %"].map((h) => <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-zinc-600 uppercase tracking-wider">{h}</th>)}
                  </tr></thead>
                  <tbody className="divide-y divide-zinc-800/50">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-zinc-800/20 transition-colors">
                        <td className="px-5 py-3"><p className="font-medium text-white text-sm">{u.name}</p><p className="text-xs text-zinc-600">{u.email}</p></td>
                        <td className="px-5 py-3 text-sm text-zinc-400 capitalize">{u.subscription.plan || "\u2014"}</td>
                        <td className="px-5 py-3"><span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${badge(u.subscription.status)}`}>{u.subscription.status}</span></td>
                        <td className="px-5 py-3"><div className="flex gap-1">{u.scores.map((s) => <span key={s.id} className="text-xs font-mono bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">{s.value}</span>)}{u.scores.length === 0 && <span className="text-xs text-zinc-700">{"\u2014"}</span>}</div></td>
                        <td className="px-5 py-3 text-sm text-zinc-400">{u.charityPercentage}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "draws" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Draw Management</h2>
                <button onClick={() => setSim(runDraw())} className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:brightness-110 transition-all">
                  <Play size={14} /> Run Simulation
                </button>
              </div>
              {sim && (
                <div className="bg-zinc-900 border border-amber-500/20 rounded-2xl p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-white">Simulation — {sim.month}</h3>
                    <div className="flex gap-2">
                      <button onClick={() => { publishDraw(sim.id); setSim(null); }} className="flex items-center gap-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium px-4 py-2 rounded-xl text-sm"><Send size={13} /> Publish</button>
                      <button onClick={() => setSim(null)} className="px-4 py-2 rounded-xl border border-zinc-700 text-zinc-400 text-sm hover:bg-zinc-800 transition-colors">Discard</button>
                    </div>
                  </div>
                  <div className="flex gap-2 mb-4">
                    {sim.winningNumbers.map((n) => <div key={n} className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm">{n}</div>)}
                  </div>
                  {sim.winners.length > 0 ? sim.winners.map((w, i) => (
                    <div key={i} className="flex items-center justify-between bg-zinc-800/40 rounded-lg px-4 py-2.5 mb-1.5 border border-zinc-800/50">
                      <span className="text-sm text-white">{w.userName}</span>
                      <span className="text-sm text-amber-400 font-medium">{w.matchType}-match {"\u00B7"} {"\u00A3"}{w.prize}</span>
                    </div>
                  )) : <p className="text-sm text-zinc-500">No winners. Jackpot rolls over.</p>}
                </div>
              )}
              <div className="space-y-4">
                {draws.map((d) => (
                  <div key={d.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-white">{d.month}</h3>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${d.status === "published" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"}`}>{d.status}</span>
                        {d.status === "pending" && <button onClick={() => publishDraw(d.id)} className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium px-3 py-1.5 rounded-lg text-xs">Publish</button>}
                      </div>
                    </div>
                    <div className="flex gap-2 mb-4">
                      {d.winningNumbers.map((n) => <div key={n} className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 font-bold text-sm">{n}</div>)}
                    </div>
                    {d.winners.length > 0 ? d.winners.map((w, i) => (
                      <div key={i} className="flex items-center justify-between bg-zinc-800/30 rounded-lg px-4 py-2 mb-1 border border-zinc-800/30">
                        <span className="text-sm text-white">{w.userName} <span className="text-zinc-600 text-xs">{w.matchType}-match</span></span>
                        <span className="text-sm font-bold text-white">{"\u00A3"}{w.prize}</span>
                      </div>
                    )) : <p className="text-sm text-zinc-700">No winners</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "charities" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Charity Management</h2>
                <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm"><Plus size={14} /> Add</button>
              </div>
              {showAdd && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6">
                  <div className="grid sm:grid-cols-2 gap-3 mb-3">
                    <input type="text" placeholder="Name" value={charityName} onChange={(e) => setCharityName(e.target.value)} className={inputClass} />
                    <input type="text" placeholder="Category" value={charityCat} onChange={(e) => setCharityCat(e.target.value)} className={inputClass} />
                  </div>
                  <textarea placeholder="Description" value={charityDesc} onChange={(e) => setCharityDesc(e.target.value)} className={`${inputClass} h-20 resize-none mb-3`} />
                  <button onClick={() => { if (charityName && charityDesc && charityCat) { addCharity({ name: charityName, description: charityDesc, category: charityCat, image: "\u{1F397}\u{FE0F}", featured: false }); setCharityName(""); setCharityDesc(""); setCharityCat(""); setShowAdd(false); }}}
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm">Create</button>
                </div>
              )}
              <div className="grid sm:grid-cols-2 gap-4">
                {charities.map((c) => (
                  <div key={c.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3"><span className="text-2xl">{c.image}</span><div><h4 className="font-semibold text-white text-sm">{c.name}</h4><span className="text-[11px] text-emerald-400">{c.category}</span></div></div>
                      <button onClick={() => { if (window.confirm("Delete?")) deleteCharity(c.id); }} className="text-zinc-700 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                    </div>
                    <p className="text-sm text-zinc-500 mb-3 line-clamp-2">{c.description}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-zinc-800/50"><span className="text-xs text-zinc-600">Raised</span><span className="font-bold text-emerald-400 text-sm">{"\u00A3"}{c.totalRaised.toLocaleString()}</span></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "winners" && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Winners Management</h2>
              {allWinners.length === 0 ? (
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-14 text-center"><Trophy size={36} className="mx-auto mb-3 text-zinc-800" /><p className="text-zinc-600">No winners yet</p></div>
              ) : (
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden overflow-x-auto">
                  <table className="w-full min-w-[700px]">
                    <thead><tr className="border-b border-zinc-800">
                      {["Winner", "Draw", "Match", "Prize", "Status", "Actions"].map((h, i) => <th key={h} className={`${i === 5 ? "text-right" : "text-left"} px-5 py-3 text-xs font-semibold text-zinc-600 uppercase tracking-wider`}>{h}</th>)}
                    </tr></thead>
                    <tbody className="divide-y divide-zinc-800/50">
                      {allWinners.map((w, i) => (
                        <tr key={i} className="hover:bg-zinc-800/20 transition-colors">
                          <td className="px-5 py-3 font-medium text-white text-sm">{w.userName}</td>
                          <td className="px-5 py-3 text-sm text-zinc-400">{w.drawMonth}</td>
                          <td className="px-5 py-3"><span className="text-[10px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">{w.matchType}-num</span></td>
                          <td className="px-5 py-3 font-bold text-white text-sm">{"\u00A3"}{w.prize}</td>
                          <td className="px-5 py-3"><span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${w.paid ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : w.verified ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-zinc-800 text-zinc-500 border border-zinc-700"}`}>{w.paid ? "Paid" : w.verified ? "Verified" : "Pending"}</span></td>
                          <td className="px-5 py-3 text-right">
                            {!w.verified && <button onClick={() => verifyWinner(w.drawId, w.userId)} className="inline-flex items-center gap-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium px-3 py-1.5 rounded-lg text-xs"><Check size={11} /> Verify</button>}
                            {w.verified && !w.paid && <button onClick={() => markPaid(w.drawId, w.userId)} className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium px-3 py-1.5 rounded-lg text-xs"><DollarSign size={11} /> Pay</button>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
