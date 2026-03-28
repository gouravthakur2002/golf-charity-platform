import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { Trophy, Heart, Target, ArrowRight, Star, Users, TrendingUp, Shield, Sparkles, ChevronRight } from "lucide-react";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

export default function Home() {
  const { charities } = useAppStore();
  const featured = charities.filter((c) => c.featured);

  return (
    <main>
      <Navbar />

      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-emerald-500/[0.07] rounded-full blur-[140px] pointer-events-none" />
        <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-28 pb-20 w-full text-center">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-1.5">
                <Sparkles size={13} className="text-emerald-400" />
                <span className="text-zinc-400 text-sm">Join 2,400+ golfers giving back</span>
                <ChevronRight size={13} className="text-zinc-600" />
              </div>
            </motion.div>

            <motion.h1 variants={fadeUp} transition={{ duration: 0.6 }} className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] mb-8">
              <span className="bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">Play Golf.</span><br />
              <span className="bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">Win Prizes.</span><br />
              <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Give Back.</span>
            </motion.h1>

            <motion.p variants={fadeUp} transition={{ duration: 0.6 }} className="text-lg md:text-xl text-zinc-500 mb-12 max-w-2xl mx-auto leading-relaxed">
              Your golf scores become lottery numbers. Match them in the monthly draw to win — while a portion of every subscription goes to charity.
            </motion.p>

            <motion.div variants={fadeUp} transition={{ duration: 0.6 }} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold px-8 py-3.5 rounded-xl hover:brightness-110 transition-all shadow-lg shadow-emerald-500/20">
                Start Playing <ArrowRight size={18} />
              </Link>
              <a href="#how-it-works" className="inline-flex items-center justify-center gap-2 border border-zinc-700 text-zinc-300 font-medium px-8 py-3.5 rounded-xl hover:bg-zinc-900 hover:border-zinc-600 transition-all">
                How It Works
              </a>
            </motion.div>

            <motion.div variants={fadeUp} transition={{ duration: 0.6, delay: 0.4 }} className="mt-20 flex items-center justify-center gap-12 md:gap-20">
              {[
                { value: "2,400+", label: "Active Players" },
                { value: "\u00A3182K", label: "Donated" },
                { value: "\u00A35K+", label: "Monthly Prizes" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-white">{s.value}</p>
                  <p className="text-zinc-600 text-sm mt-1">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section id="how-it-works" className="py-28 border-t border-zinc-800/50">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}>
            <motion.div variants={fadeUp} className="text-center mb-16">
              <p className="text-emerald-400 text-sm font-semibold tracking-wider uppercase mb-3">How It Works</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white">Three steps to impact</h2>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: <Target size={24} />, step: "01", title: "Enter Your Scores", desc: "Submit your last 5 Stableford scores. Each score becomes a number in your monthly draw entry.", iconBg: "bg-emerald-500/10 text-emerald-400" },
                { icon: <Trophy size={24} />, step: "02", title: "Win Monthly Prizes", desc: "Match your score numbers to the draw. 3, 4, or 5 matches win you a share of the prize pool.", iconBg: "bg-amber-500/10 text-amber-400" },
                { icon: <Heart size={24} />, step: "03", title: "Support a Charity", desc: "Choose a charity at signup. At least 10% of your subscription goes directly to them.", iconBg: "bg-rose-500/10 text-rose-400" },
              ].map((item) => (
                <motion.div key={item.step} variants={fadeUp} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 relative overflow-hidden hover:border-zinc-700 transition-colors">
                  <span className="absolute top-4 right-6 text-6xl font-black text-zinc-800/60">{item.step}</span>
                  <div className={`w-12 h-12 rounded-xl ${item.iconBg} flex items-center justify-center mb-5`}>{item.icon}</div>
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-28 border-t border-zinc-800/50">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}>
            <motion.div variants={fadeUp} className="text-center mb-16">
              <p className="text-amber-400 text-sm font-semibold tracking-wider uppercase mb-3">Prize Pool</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white">The more you match, the more you win</h2>
            </motion.div>
            <motion.div variants={fadeUp} className="grid md:grid-cols-3 gap-6">
              {[
                { match: "5 Numbers", share: "40%", label: "JACKPOT", rollover: true, borderColor: "border-amber-500/30", labelColor: "text-amber-400" },
                { match: "4 Numbers", share: "35%", label: "2ND PRIZE", rollover: false, borderColor: "border-emerald-500/30", labelColor: "text-emerald-400" },
                { match: "3 Numbers", share: "25%", label: "3RD PRIZE", rollover: false, borderColor: "border-zinc-700", labelColor: "text-zinc-400" },
              ].map((tier) => (
                <div key={tier.match} className={`rounded-2xl border ${tier.borderColor} bg-zinc-900 p-8 text-center`}>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className={`text-xs font-bold tracking-widest ${tier.labelColor}`}>{tier.label}</span>
                    {tier.rollover && <span className="text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">ROLLS OVER</span>}
                  </div>
                  <p className="text-5xl font-black text-white mb-1">{tier.share}</p>
                  <p className="text-zinc-500 text-sm mb-4">of prize pool</p>
                  <div className="pt-4 border-t border-zinc-800">
                    <p className="text-zinc-400 text-sm">Match <span className="text-white font-semibold">{tier.match}</span></p>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-28 border-t border-zinc-800/50">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}>
            <motion.div variants={fadeUp} className="text-center mb-16">
              <p className="text-rose-400 text-sm font-semibold tracking-wider uppercase mb-3">Charities</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white">Choose a cause you believe in</h2>
            </motion.div>
            <motion.div variants={fadeUp} className="grid md:grid-cols-3 gap-6">
              {featured.map((c) => (
                <div key={c.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-3xl">{c.image}</span>
                    <span className="text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">{c.category}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{c.name}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed mb-5 line-clamp-3">{c.description}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                    <span className="text-xs text-zinc-600">Total Raised</span>
                    <span className="text-lg font-bold text-emerald-400">{"\u00A3"}{c.totalRaised.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </motion.div>
            <motion.div variants={fadeUp} className="text-center mt-10">
              <Link to="/charities" className="inline-flex items-center gap-2 text-emerald-400 text-sm font-semibold hover:text-emerald-300 transition-colors">
                View All Charities <ArrowRight size={16} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-28 border-t border-zinc-800/50">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold text-white mb-14">Built on trust</motion.h2>
            <motion.div variants={fadeUp} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: <Shield size={22} />, title: "Secure Payments", desc: "PCI-compliant via Stripe", color: "bg-emerald-500/10 text-emerald-400" },
                { icon: <Star size={22} />, title: "Fair Draws", desc: "Transparent & verifiable", color: "bg-amber-500/10 text-amber-400" },
                { icon: <Users size={22} />, title: "Real Impact", desc: "Direct charity contributions", color: "bg-rose-500/10 text-rose-400" },
                { icon: <TrendingUp size={22} />, title: "Track Progress", desc: "Monitor scores & winnings", color: "bg-sky-500/10 text-sky-400" },
              ].map((item) => (
                <div key={item.title} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                  <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center mx-auto mb-4`}>{item.icon}</div>
                  <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                  <p className="text-zinc-500 text-sm">{item.desc}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-28 border-t border-zinc-800/50 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-emerald-500/[0.05] rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-5">Ready to make every round count?</h2>
          <p className="text-lg text-zinc-500 mb-10">Join golfers who play with purpose.</p>
          <Link to="/signup" className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold px-8 py-3.5 rounded-xl hover:brightness-110 transition-all shadow-lg shadow-emerald-500/20">
            Subscribe — From {"\u00A3"}9.99/mo <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <footer className="border-t border-zinc-800/50 py-10">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <span className="text-white font-bold text-xs">G</span>
            </div>
            <span className="font-bold text-sm text-white">Golf<span className="text-emerald-400">Give</span></span>
          </div>
          <div className="flex gap-8 text-sm text-zinc-600">
            <Link to="/charities" className="hover:text-zinc-300 transition-colors">Charities</Link>
            <Link to="/login" className="hover:text-zinc-300 transition-colors">Login</Link>
            <Link to="/signup" className="hover:text-zinc-300 transition-colors">Sign Up</Link>
          </div>
          <p className="text-sm text-zinc-700">{"\u00A9"} 2026 GolfGive</p>
        </div>
      </footer>
    </main>
  );
}
