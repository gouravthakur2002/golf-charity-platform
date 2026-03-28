import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Score {
  id: string;
  value: number;
  date: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "subscriber" | "admin";
  subscription: {
    plan: "monthly" | "yearly" | null;
    status: "active" | "inactive" | "lapsed";
    renewalDate: string | null;
  };
  scores: Score[];
  charityId: string | null;
  charityPercentage: number;
  totalWinnings: number;
  drawsEntered: number;
}

export interface Charity {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  totalRaised: number;
  featured: boolean;
}

export interface DrawResult {
  id: string;
  month: string;
  date: string;
  winningNumbers: number[];
  status: "pending" | "published";
  winners: {
    userId: string;
    userName: string;
    matchType: 3 | 4 | 5;
    prize: number;
    verified: boolean;
    paid: boolean;
  }[];
}

interface AppState {
  currentUser: User | null;
  users: User[];
  charities: Charity[];
  draws: DrawResult[];
  prizePool: number;
  jackpotRollover: number;

  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string) => boolean;
  logout: () => void;

  addScore: (value: number, date: string) => void;
  deleteScore: (scoreId: string) => void;

  selectCharity: (charityId: string) => void;
  setCharityPercentage: (percentage: number) => void;

  subscribe: (plan: "monthly" | "yearly") => void;
  cancelSubscription: () => void;

  runDraw: () => DrawResult;
  publishDraw: (drawId: string) => void;
  verifyWinner: (drawId: string, userId: string) => void;
  markPaid: (drawId: string, userId: string) => void;
  addCharity: (charity: Omit<Charity, "id" | "totalRaised">) => void;
  deleteCharity: (charityId: string) => void;
}

const defaultCharities: Charity[] = [
  { id: "c1", name: "Golf for Good Foundation", description: "Bringing golf to underprivileged communities worldwide. We provide equipment, coaching, and course access to young people who would never otherwise experience the sport.", category: "Youth Development", image: "\u{1F30D}", totalRaised: 45200, featured: true },
  { id: "c2", name: "Green Fairways Trust", description: "Environmental conservation through sustainable golf course management. We plant trees, restore wetlands, and protect wildlife habitats on courses across the country.", category: "Environment", image: "\u{1F33F}", totalRaised: 32100, featured: false },
  { id: "c3", name: "Swing for Hope", description: "Mental health support for athletes and sports enthusiasts. We fund counselling services, run wellness workshops, and create safe spaces within sports communities.", category: "Mental Health", image: "\u{1F499}", totalRaised: 28400, featured: true },
  { id: "c4", name: "Fairway Future", description: "Scholarship programme for talented young golfers from low-income families. We cover tournament fees, travel expenses, and academic tutoring.", category: "Education", image: "\u{1F393}", totalRaised: 51800, featured: false },
  { id: "c5", name: "Veterans on the Green", description: "Rehabilitation and social reintegration for military veterans through golf therapy programmes. Golf as a pathway to recovery and community.", category: "Veterans", image: "\u{1F396}\u{FE0F}", totalRaised: 39600, featured: true },
  { id: "c6", name: "Disability Golf Alliance", description: "Making golf accessible to people with physical and learning disabilities. We adapt equipment, train coaches, and create inclusive playing environments.", category: "Accessibility", image: "\u{267F}", totalRaised: 22900, featured: false },
];

const demoUsers: User[] = [
  {
    id: "u1", name: "James Wilson", email: "james@example.com", role: "subscriber",
    subscription: { plan: "monthly", status: "active", renewalDate: "2026-04-15" },
    scores: [
      { id: "s1", value: 34, date: "2026-03-20" },
      { id: "s2", value: 28, date: "2026-03-15" },
      { id: "s3", value: 31, date: "2026-03-10" },
      { id: "s4", value: 37, date: "2026-03-05" },
      { id: "s5", value: 29, date: "2026-02-28" },
    ],
    charityId: "c1", charityPercentage: 15, totalWinnings: 250, drawsEntered: 4,
  },
  {
    id: "u2", name: "Sarah Chen", email: "sarah@example.com", role: "subscriber",
    subscription: { plan: "yearly", status: "active", renewalDate: "2027-01-10" },
    scores: [
      { id: "s6", value: 38, date: "2026-03-22" },
      { id: "s7", value: 33, date: "2026-03-18" },
      { id: "s8", value: 41, date: "2026-03-12" },
      { id: "s9", value: 27, date: "2026-03-06" },
      { id: "s10", value: 35, date: "2026-02-25" },
    ],
    charityId: "c3", charityPercentage: 20, totalWinnings: 500, drawsEntered: 6,
  },
  {
    id: "u3", name: "Michael O'Brien", email: "michael@example.com", role: "subscriber",
    subscription: { plan: "monthly", status: "active", renewalDate: "2026-04-01" },
    scores: [
      { id: "s11", value: 25, date: "2026-03-21" },
      { id: "s12", value: 30, date: "2026-03-14" },
      { id: "s13", value: 42, date: "2026-03-07" },
    ],
    charityId: "c5", charityPercentage: 10, totalWinnings: 0, drawsEntered: 3,
  },
];

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: demoUsers,
      charities: defaultCharities,
      draws: [
        {
          id: "d1", month: "February 2026", date: "2026-02-28",
          winningNumbers: [34, 28, 31, 37, 29], status: "published",
          winners: [
            { userId: "u1", userName: "James Wilson", matchType: 3, prize: 125, verified: true, paid: true },
            { userId: "u2", userName: "Sarah Chen", matchType: 4, prize: 500, verified: true, paid: true },
          ],
        },
      ],
      prizePool: 2400,
      jackpotRollover: 800,

      login: (email, password) => {
        if (email === "admin@golfcharity.com" && password === "admin123") {
          const adminUser: User = {
            id: "admin", name: "Admin", email: "admin@golfcharity.com", role: "admin",
            subscription: { plan: null, status: "active", renewalDate: null },
            scores: [], charityId: null, charityPercentage: 0, totalWinnings: 0, drawsEntered: 0,
          };
          set({ currentUser: adminUser });
          return true;
        }
        const user = get().users.find((u) => u.email === email);
        if (user) { set({ currentUser: user }); return true; }
        return false;
      },

      signup: (name, email) => {
        const exists = get().users.find((u) => u.email === email);
        if (exists) return false;
        const newUser: User = {
          id: generateId(), name, email, role: "subscriber",
          subscription: { plan: null, status: "inactive", renewalDate: null },
          scores: [], charityId: null, charityPercentage: 10, totalWinnings: 0, drawsEntered: 0,
        };
        set((state) => ({ users: [...state.users, newUser], currentUser: newUser }));
        return true;
      },

      logout: () => set({ currentUser: null }),

      addScore: (value, date) => {
        const { currentUser, users } = get();
        if (!currentUser) return;
        const newScore: Score = { id: generateId(), value, date };
        let updatedScores = [...currentUser.scores, newScore];
        updatedScores.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        if (updatedScores.length > 5) updatedScores = updatedScores.slice(0, 5);
        const updatedUser = { ...currentUser, scores: updatedScores };
        set({ currentUser: updatedUser, users: users.map((u) => (u.id === currentUser.id ? updatedUser : u)) });
      },

      deleteScore: (scoreId) => {
        const { currentUser, users } = get();
        if (!currentUser) return;
        const updatedScores = currentUser.scores.filter((s) => s.id !== scoreId);
        const updatedUser = { ...currentUser, scores: updatedScores };
        set({ currentUser: updatedUser, users: users.map((u) => (u.id === currentUser.id ? updatedUser : u)) });
      },

      selectCharity: (charityId) => {
        const { currentUser, users } = get();
        if (!currentUser) return;
        const updatedUser = { ...currentUser, charityId };
        set({ currentUser: updatedUser, users: users.map((u) => (u.id === currentUser.id ? updatedUser : u)) });
      },

      setCharityPercentage: (percentage) => {
        const { currentUser, users } = get();
        if (!currentUser) return;
        const updatedUser = { ...currentUser, charityPercentage: Math.max(10, percentage) };
        set({ currentUser: updatedUser, users: users.map((u) => (u.id === currentUser.id ? updatedUser : u)) });
      },

      subscribe: (plan) => {
        const { currentUser, users } = get();
        if (!currentUser) return;
        const renewalDate = plan === "monthly"
          ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
          : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
        const updatedUser = { ...currentUser, subscription: { plan, status: "active" as const, renewalDate } };
        set({ currentUser: updatedUser, users: users.map((u) => (u.id === currentUser.id ? updatedUser : u)), prizePool: get().prizePool + (plan === "monthly" ? 15 : 150) });
      },

      cancelSubscription: () => {
        const { currentUser, users } = get();
        if (!currentUser) return;
        const updatedUser = { ...currentUser, subscription: { plan: null, status: "inactive" as const, renewalDate: null } };
        set({ currentUser: updatedUser, users: users.map((u) => (u.id === currentUser.id ? updatedUser : u)) });
      },

      runDraw: () => {
        const { users, jackpotRollover, prizePool } = get();
        const activeUsers = users.filter((u) => u.subscription.status === "active" && u.scores.length >= 3);
        const winningNumbers: number[] = [];
        for (let i = 0; i < 5; i++) {
          let num: number;
          do { num = Math.floor(Math.random() * 45) + 1; } while (winningNumbers.includes(num));
          winningNumbers.push(num);
        }
        winningNumbers.sort((a, b) => a - b);

        const winners: DrawResult["winners"] = [];
        const pool5 = prizePool * 0.4 + jackpotRollover;
        const pool4 = prizePool * 0.35;
        const pool3 = prizePool * 0.25;

        activeUsers.forEach((user) => {
          const userNumbers = user.scores.map((s) => s.value).sort((a, b) => a - b);
          let matches = 0;
          userNumbers.forEach((num) => { if (winningNumbers.includes(num)) matches++; });
          if (matches >= 3) {
            winners.push({ userId: user.id, userName: user.name, matchType: Math.min(matches, 5) as 3 | 4 | 5, prize: 0, verified: false, paid: false });
          }
        });

        const winners5 = winners.filter((w) => w.matchType === 5);
        const winners4 = winners.filter((w) => w.matchType === 4);
        const winners3 = winners.filter((w) => w.matchType === 3);
        winners5.forEach((w) => (w.prize = Math.round(pool5 / winners5.length)));
        winners4.forEach((w) => (w.prize = Math.round(pool4 / Math.max(winners4.length, 1))));
        winners3.forEach((w) => (w.prize = Math.round(pool3 / Math.max(winners3.length, 1))));

        const now = new Date();
        const newDraw: DrawResult = {
          id: generateId(),
          month: now.toLocaleString("default", { month: "long", year: "numeric" }),
          date: now.toISOString().split("T")[0],
          winningNumbers, status: "pending", winners,
        };
        set((state) => ({ draws: [newDraw, ...state.draws], jackpotRollover: winners5.length === 0 ? jackpotRollover + prizePool * 0.4 : 0 }));
        return newDraw;
      },

      publishDraw: (drawId) => {
        set((state) => ({ draws: state.draws.map((d) => (d.id === drawId ? { ...d, status: "published" } : d)) }));
      },

      verifyWinner: (drawId, userId) => {
        set((state) => ({
          draws: state.draws.map((d) => d.id === drawId ? { ...d, winners: d.winners.map((w) => w.userId === userId ? { ...w, verified: true } : w) } : d),
        }));
      },

      markPaid: (drawId, userId) => {
        set((state) => ({
          draws: state.draws.map((d) => d.id === drawId ? { ...d, winners: d.winners.map((w) => w.userId === userId ? { ...w, paid: true } : w) } : d),
        }));
      },

      addCharity: (charity) => {
        const newCharity: Charity = { ...charity, id: generateId(), totalRaised: 0 };
        set((state) => ({ charities: [...state.charities, newCharity] }));
      },

      deleteCharity: (charityId) => {
        set((state) => ({ charities: state.charities.filter((c) => c.id !== charityId) }));
      },
    }),
    { name: "golf-charity-store", version: 3 }
  )
);
