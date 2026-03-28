import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppStore } from "@/lib/store";
import { motion } from "framer-motion";
import { Trophy, Heart, Target, Calendar, Plus, Trash2, LogOut, Crown, TrendingUp, AlertCircle, Check } from "lucide-react";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { currentUser, charities, draws, logout, addScore, deleteScore, selectCharity, setCharityPercentage, cancelSubscription } = useAppStore();
  const [newScore, setNewScore] = useState("");
  const [newDate, setNewDate] = useState(new Date().toISOString().split("T")[0]);
  const [scoreError, setScoreError] = useState("");
  const [activeTab, setActiveTab] = useState<"scores" | "charity" | "draws" | "winnings">("scores");

  if (!currentUser) { navigate("/login"); return null; }

  if (currentUser.subscription.status !== "active") {
    return (
      <div className="min-h-screen flex items-center justify-center px-5">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-10 max-w-md text-center">
          <AlertCircle size={36} className="text-amber-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Subscription Required</h2>
          <p className="text-zinc-500 text-sm mb-6">You need an active subscription to access the dashboard.</p>
          <Link to="/subscribe" className="inline-block bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold px-6 py-2.5 rounded-xl">Choose a Plan</Link>
        </div>
      </div>
    );
  }

  const selectedCharity = charities.find((c) => c.id === currentUser.charityId);
  const publishedDraws = draws.filter((d) => d.status === "published");
  const myWins = publishedDraws.flatMap((d) => d.winners.filter((w) => w.userId === currentUser.id).map((w) => ({ ...w, drawMonth: d.month })));
  const inputClass = "w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm outline-none focus:border-emerald-500 transition-colors placeholder:text-zinc-600";

  const handleAddScore = () => {
    setScoreError("");
    const val = parseInt(newScore);
    if (isNaN(val) || val < 1 || val > 45) { setScoreError("Score must be between 1 and 45"); return; }
    addScore(val, newDate);
    setNewScore("");
  };

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center"><span className="text-white font-bold text-sm">G</span></div>
            <span className="font-bold text-lg text-white">Golf<span className="text-emerald-400">Give</span></span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-sm text-zinc-500">{currentUser.name}</span>
            <button onClick={() => { logout(); navigate("/"); }} className="text-zinc-600 hover:text-white transition-colors"><LogOut size={16} /></button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8">
        <h1 className="text-2xl font-bold text-white mb-1">Welcome back, {currentUser.name.split(" ")[0]}</h1>
        <p className="text-zinc-600 text-sm mb-8">Your performance and impact overview</p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Subscription", value: `${currentUser.subscription.plan}`, sub: `Renews ${currentUser.subscription.renewalDate}`, icon: <Crown size={16} />, color: "text-emerald-400 bg-emerald-500/10" },
            { label: "Scores", value: `${currentUser.scores.length} / 5`, sub: currentUser.scores.length >= 5 ? "Ready for draws" : `Need ${5 - currentUser.scores.length} more`, icon: <Target size={16} />, color: "text-amber-400 bg-amber-500/10" },
            { label: "Draws Entered", value: `${currentUser.drawsEntered}`, sub: "Next: April 2026", icon: <Trophy size={16} />, color: "text-rose-400 bg-rose-500/10" },
            { label: "Winnings", value: `\u00A3${currentUser.totalWinnings}`, sub: `${myWins.length} win${myWins.length !== 1 ? "s" : ""}`, icon: <TrendingUp size={16} />, color: "text-sky-400 bg-sky-500/10" },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-8 h-8 rounded-lg ${s.color} flex items-center justify-center`}>{s.icon}</div>
                <span className="text-xs text-zinc-600">{s.label}</span>
              </div>
              <p className="text-lg font-bold text-white capitalize">{s.value}</p>
              <p className="text-xs text-zinc-600 mt-0.5">{s.sub}</p>
            </motion.div>
          ))}
        </div>

        <div className="flex gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-xl mb-6 overflow-x-auto">
          {([
            { id: "scores", label: "Scores", icon: <Target size={15} /> },
            { id: "charity", label: "Charity", icon: <Heart size={15} /> },
            { id: "draws", label: "Draws", icon: <Trophy size={15} /> },
            { id: "winnings", label: "Winnings", icon: <TrendingUp size={15} /> },
          ] as const).map((t) => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === t.id ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"}`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }}>
          {activeTab === "scores" && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8">
              <h2 className="text-lg font-bold text-white mb-1">Your Golf Scores</h2>
              <p className="text-zinc-600 text-sm mb-6">Stableford scores (1-45). Latest 5 kept.</p>
              <div className="flex flex-col sm:flex-row gap-3 mb-6 p-4 bg-zinc-800/40 border border-zinc-800 rounded-xl">
                <div className="flex-1">
                  <label className="block text-xs text-zinc-500 mb-1">Score (1-45)</label>
                  <input type="number" min="1" max="45" value={newScore} onChange={(e) => setNewScore(e.target.value)} placeholder="e.g. 34" className={inputClass} />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-zinc-500 mb-1">Date Played</label>
                  <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className={inputClass} />
                </div>
                <div className="flex items-end">
                  <button onClick={handleAddScore} className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:brightness-110 transition-all whitespace-nowrap">
                    <Plus size={15} /> Add
                  </button>
                </div>
              </div>
              {scoreError && <p className="text-red-400 text-sm mb-4">{scoreError}</p>}
              {currentUser.scores.length === 0 ? (
                <div className="text-center py-14"><Target size={36} className="mx-auto mb-3 text-zinc-800" /><p className="text-zinc-600">No scores yet.</p></div>
              ) : (
                <div className="space-y-2">
                  {currentUser.scores.map((score, idx) => (
                    <div key={score.id} className="flex items-center justify-between p-4 rounded-xl bg-zinc-800/30 border border-zinc-800/50 hover:border-zinc-700/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold">{score.value}</div>
                        <div>
                          <p className="font-semibold text-white text-sm">{score.value} points</p>
                          <p className="text-xs text-zinc-600 flex items-center gap-1"><Calendar size={10} />{new Date(score.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {idx === 0 && <span className="text-[10px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">Latest</span>}
                        <button onClick={() => deleteScore(score.id)} className="text-zinc-700 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {currentUser.scores.length > 0 && (
                <div className="mt-6 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                  <p className="text-sm text-emerald-400">Draw numbers: <span className="font-bold font-mono">{currentUser.scores.map((s) => s.value).join(" \u00B7 ")}</span></p>
                </div>
              )}
            </div>
          )}

          {activeTab === "charity" && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8">
              <h2 className="text-lg font-bold text-white mb-1">Your Charity</h2>
              <p className="text-zinc-600 text-sm mb-6">Choose a charity and set contribution (min 10%)</p>
              {selectedCharity && (
                <div className="p-5 bg-emerald-500/5 border border-emerald-500/10 rounded-xl mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">{selectedCharity.image}</span>
                    <div><p className="font-semibold text-white">{selectedCharity.name}</p><p className="text-xs text-emerald-400">{selectedCharity.category}</p></div>
                  </div>
                  <label className="block text-sm text-zinc-400 mb-2">Contribution: <span className="text-emerald-400 font-bold">{currentUser.charityPercentage}%</span></label>
                  <input type="range" min="10" max="50" value={currentUser.charityPercentage} onChange={(e) => setCharityPercentage(parseInt(e.target.value))} className="w-full accent-emerald-500" />
                  <div className="flex justify-between text-xs text-zinc-600 mt-1"><span>10%</span><span>50%</span></div>
                </div>
              )}
              <div className="grid sm:grid-cols-2 gap-3">
                {charities.map((c) => (
                  <button key={c.id} onClick={() => selectCharity(c.id)}
                    className={`text-left p-4 rounded-xl border transition-all ${currentUser.charityId === c.id ? "border-emerald-500/30 bg-emerald-500/5" : "border-zinc-800 bg-zinc-800/30 hover:border-zinc-700"}`}>
                    <div className="flex items-start gap-3">
                      <span className="text-xl">{c.image}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white text-sm">{c.name}</p>
                        <p className="text-xs text-zinc-600">{c.category}</p>
                        <p className="text-xs text-emerald-500 font-medium mt-1">{"\u00A3"}{c.totalRaised.toLocaleString()}</p>
                      </div>
                      {currentUser.charityId === c.id && <Check size={15} className="text-emerald-400 shrink-0 mt-1" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === "draws" && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8">
              <h2 className="text-lg font-bold text-white mb-1">Draw Results</h2>
              <p className="text-zinc-600 text-sm mb-6">Past draws and your matches</p>
              {publishedDraws.length === 0 ? (
                <div className="text-center py-14"><Trophy size={36} className="mx-auto mb-3 text-zinc-800" /><p className="text-zinc-600">No draws published yet.</p></div>
              ) : (
                <div className="space-y-4">
                  {publishedDraws.map((draw) => {
                    const myScores = currentUser.scores.map((s) => s.value);
                    const matches = draw.winningNumbers.filter((n) => myScores.includes(n));
                    return (
                      <div key={draw.id} className="p-5 rounded-xl bg-zinc-800/30 border border-zinc-800/50">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-white">{draw.month}</h3>
                          <span className="text-[10px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">Published</span>
                        </div>
                        <div className="flex gap-2 mb-3">
                          {draw.winningNumbers.map((num) => (
                            <div key={num} className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${myScores.includes(num) ? "bg-gradient-to-br from-amber-500 to-orange-500 text-white" : "bg-zinc-800 border border-zinc-700 text-zinc-300"}`}>{num}</div>
                          ))}
                        </div>
                        <p className="text-sm text-zinc-500">Matched <span className="font-bold text-white">{matches.length}</span>{matches.length >= 3 && <span className="text-amber-400 font-semibold"> — Winner!</span>}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === "winnings" && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8">
              <h2 className="text-lg font-bold text-white mb-1">Your Winnings</h2>
              <p className="text-zinc-600 text-sm mb-6">Prizes and payment status</p>
              <div className="p-5 bg-emerald-500/5 border border-emerald-500/10 rounded-xl mb-6 text-center">
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Total Winnings</p>
                <p className="text-4xl font-black text-emerald-400">{"\u00A3"}{currentUser.totalWinnings}</p>
              </div>
              {myWins.length === 0 ? (
                <div className="text-center py-10"><TrendingUp size={36} className="mx-auto mb-3 text-zinc-800" /><p className="text-zinc-600">No winnings yet.</p></div>
              ) : (
                <div className="space-y-2">
                  {myWins.map((w, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-zinc-800/30 border border-zinc-800/50">
                      <div><p className="font-semibold text-white text-sm">{w.drawMonth}</p><p className="text-xs text-zinc-600">{w.matchType}-Number Match</p></div>
                      <div className="text-right">
                        <p className="font-bold text-white text-sm">{"\u00A3"}{w.prize}</p>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${w.paid ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : w.verified ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-zinc-800 text-zinc-500 border border-zinc-700"}`}>
                          {w.paid ? "Paid" : w.verified ? "Pending Payment" : "Pending Verification"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>

        <div className="mt-8 text-center">
          <button onClick={() => { if (window.confirm("Cancel subscription?")) cancelSubscription(); }} className="text-xs text-zinc-700 hover:text-red-400 transition-colors">Cancel Subscription</button>
        </div>
      </div>
    </div>
  );
}
