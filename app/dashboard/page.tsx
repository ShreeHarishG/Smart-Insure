"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface UserData {
  name?: string;
  email?: string;
  role?: string;
}

interface DashboardStats {
  totalClients: number;
  totalDocuments: number;
  upcomingBirthdays: number;
  todayBirthdays: number;
}

interface BirthdayItem {
  name: string;
  date_of_birth: string;
  relationship: string;
  phone?: string;
  client_id: string;
}

interface DocumentItem {
  name: string;
  file_name: string;
  file_type: string;
  file_size: number;
  created_at: string;
  client_name?: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [stats, setStats] = useState<DashboardStats>({ totalClients: 0, totalDocuments: 0, upcomingBirthdays: 0, todayBirthdays: 0 });
  const [birthdays, setBirthdays] = useState<BirthdayItem[]>([]);
  const [recentDocs, setRecentDocs] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = window.localStorage.getItem("supabase_user");
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {
        setUser(null);
      }
    }
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      const [clientsRes, docsRes, birthdaysRes] = await Promise.all([
        fetch("/api/clients"),
        fetch("/api/documents"),
        fetch("/api/birthdays?range=week"),
      ]);

      const clientsData = await clientsRes.json();
      const docsData = await docsRes.json();
      const birthdaysData = await birthdaysRes.json();

      setStats({
        totalClients: clientsData.total || 0,
        totalDocuments: docsData.total || 0,
        upcomingBirthdays: birthdaysData.stats?.thisWeek || 0,
        todayBirthdays: birthdaysData.stats?.today || 0,
      });

      setBirthdays((birthdaysData.birthdays || []).slice(0, 3));
      setRecentDocs((docsData.documents || []).slice(0, 4));
    } catch {
      // Fallback silently
    } finally {
      setLoading(false);
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  const formatRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "Yesterday";
    return `${diffDays} days ago`;
  };

  const getNextBday = (dob: string) => {
    const birth = new Date(dob);
    const now = new Date();
    const thisYear = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
    const next = thisYear >= now ? thisYear : new Date(now.getFullYear() + 1, birth.getMonth(), birth.getDate());
    return next.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  };

  const getAge = (dob: string) => {
    const birth = new Date(dob);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
    return age + 1; // turning age
  };

  const getDocColor = (type: string) => {
    switch (type) {
      case "PDF": return "bg-rose-50 text-rose-600";
      case "IMG": return "bg-amber-50 text-amber-600";
      case "DOC": return "bg-indigo-50 text-indigo-600";
      default: return "bg-emerald-50 text-emerald-600";
    }
  };

  const agentStatCards = [
    { label: "Total Clients", value: stats.totalClients.toString(), growth: "Active", icon: "👥", color: "bg-blue-600" },
    { label: "Documents", value: stats.totalDocuments.toString(), growth: "Stored", icon: "📁", color: "bg-indigo-600" },
    { label: "Upcoming Birthdays", value: stats.upcomingBirthdays.toString(), growth: "This week", icon: "🎂", color: "bg-rose-500" },
    { 
      label: stats.todayBirthdays === 0 ? "No birthdays today" : "Today's Birthdays", 
      value: stats.todayBirthdays === 0 ? "—" : stats.todayBirthdays.toString(), 
      growth: "Today", 
      icon: "⚡", 
      color: stats.todayBirthdays === 0 ? "bg-slate-300" : "bg-amber-500",
      valueColor: stats.todayBirthdays === 0 ? "text-slate-300" : "text-navy",
      labelColor: stats.todayBirthdays === 0 ? "text-slate-400" : "text-slate-400"
    },
  ];

  return (
    <>
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 md:mb-12">
        <div className="animate-in fade-in slide-in-from-left-4 duration-500">
          <h1 className="text-[28px] font-black tracking-tight text-navy mb-2 italic">
            {getGreeting()}, <span className="text-primary not-italic">{user?.name?.split(" ")[0] || "Guest"}</span>
          </h1>
          <p className="text-slate-500 font-medium flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Everything looks great with your portal today.
          </p>
        </div>

        <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="hidden sm:flex items-center gap-3 px-5 py-2.5 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stats.totalClients} Clients Total</span>
          </div>
          <Link href="/dashboard/clients" className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-500 hover:text-primary hover:border-primary transition-all shadow-sm group">
            <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </Link>
        </div>
      </header>

      {/* Quick Actions */}
      <section className="mb-8 md:mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
        <div className="flex flex-wrap gap-3">
          {[
            { label: "New Client", icon: "👤", color: "hover:bg-blue-50", href: "/dashboard/clients?action=add" },
            { label: "Upload Policy", icon: "📄", color: "hover:bg-emerald-50", href: "/dashboard/documents" },
            { label: "Send Birthdays", icon: "🎂", color: "hover:bg-rose-50", href: "/dashboard/birthdays" },
            { label: "View Clients", icon: "📊", color: "hover:bg-amber-50", href: "/dashboard/clients" },
          ].map((action) => (
            <Link key={action.label} href={action.href} className={`flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-slate-100 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 font-bold text-xs text-navy ${action.color}`}>
              <span className="text-base">{action.icon}</span>
              {action.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {agentStatCards.map((stat, idx) => (
          <div
            key={stat.label}
            className="group p-6 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-in fade-in zoom-in-95"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className={`w-14 h-14 rounded-xl ${stat.color} flex items-center justify-center text-2xl shadow-lg shadow-black/5 group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                  {stat.growth}
                </span>
              </div>
            </div>
            <div>
              <h3 className={`text-3xl font-black tracking-tight ${stat.valueColor || "text-navy"}`}>{loading ? "—" : stat.value}</h3>
              <p className={`text-sm font-bold uppercase tracking-widest mt-1 ${stat.labelColor || "text-slate-400"}`}>{stat.label}</p>
            </div>
          </div>
        ))}
      </section>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content Area - Recent Documents */}
        <section className="lg:col-span-2 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <div className="bg-white p-6 md:p-8 rounded-xl border border-slate-100 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-xl md:text-2xl font-black text-navy">Recent Documents</h2>
                <p className="text-sm text-slate-500 font-medium">Latest updates from your policy folder</p>
              </div>
              <Link href="/dashboard/documents" className="px-5 py-2.5 rounded-xl bg-slate-50 text-sm font-bold text-primary hover:bg-primary hover:text-white transition-all border border-slate-100">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {loading ? (
                <div className="space-y-4 py-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl animate-pulse bg-slate-50 border border-slate-100">
                      <div className="w-12 h-12 rounded-xl bg-slate-200 shrink-0"></div>
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-slate-200 rounded-md w-1/3"></div>
                        <div className="h-3 bg-slate-200 rounded-md w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentDocs.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-slate-400 font-medium">No documents uploaded yet</p>
                  <Link href="/dashboard/documents" className="text-primary font-bold text-sm mt-2 inline-block hover:underline">Upload your first document →</Link>
                </div>
              ) : (
                recentDocs.map((doc, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-200 group">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl ${getDocColor(doc.file_type)} flex items-center justify-center font-black text-xs`}>
                        {doc.file_type}
                      </div>
                      <div>
                        <p className="font-bold text-navy group-hover:text-primary transition-colors">{doc.file_name}</p>
                        <p className="text-xs text-slate-500 font-medium">{formatSize(doc.file_size)} • {formatRelativeTime(doc.created_at)}{doc.client_name ? ` • ${doc.client_name}` : ""}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-navy to-slate-900 p-8 md:p-10 rounded-xl text-white shadow-[0_4px_20px_rgba(13,59,114,0.08)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-all duration-700"></div>
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-black mb-4">Manage Your Clients</h3>
              <p className="text-slate-400 text-sm md:text-base max-w-md mb-8 leading-relaxed">
                Add new clients, manage family members, upload policy documents, and track birthdays — all from one centralized portal.
              </p>
              <Link href="/dashboard/clients" className="px-6 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl bg-primary hover:bg-primary-dark text-white font-bold transition-all shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 inline-block text-sm md:text-base">
                Open Client Directory
              </Link>
            </div>
          </div>
        </section>

        {/* Sidebar Area - Birthdays */}
        <section className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700 delay-500">
          <div className="bg-white p-6 md:p-8 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-black text-navy flex items-center gap-2">
                <span className="text-2xl">🎂</span> Birthdays
              </h2>
              <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/5 px-2 py-1 rounded-md">This Week</span>
            </div>
            <div className="space-y-6">
              {loading ? (
                <div className="space-y-6 py-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between animate-pulse">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 shrink-0"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-slate-100 rounded-md w-24"></div>
                          <div className="h-3 bg-slate-100 rounded-md w-32"></div>
                        </div>
                      </div>
                      <div className="h-4 bg-slate-100 rounded-md w-12"></div>
                    </div>
                  ))}
                </div>
              ) : birthdays.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-slate-400 font-medium text-sm">No birthdays this week</p>
                </div>
              ) : (
                birthdays.map((bday) => (
                  <div key={bday.name + bday.date_of_birth} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 font-black text-lg border border-rose-100 group-hover:scale-110 transition-transform">
                        {bday.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-black text-navy">{bday.name}</p>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">{bday.relationship} • Turning {getAge(bday.date_of_birth)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-rose-500">{getNextBday(bday.date_of_birth)}</p>
                      {bday.phone && (
                        <a
                          href={`https://wa.me/${bday.phone.replace(/\s/g, "")}?text=Happy%20Birthday%20${bday.name}!`}
                          target="_blank"
                          className="text-[10px] font-black text-emerald-600 hover:underline uppercase tracking-tighter"
                        >
                          Send Wish
                        </a>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
            <Link href="/dashboard/birthdays" className="w-full mt-10 py-4 rounded-2xl bg-slate-50 text-navy text-xs font-black uppercase tracking-widest hover:bg-slate-100 transition-all border border-slate-100 active:scale-95 block text-center">
              Open Calendar
            </Link>
          </div>


        </section>
      </div>
    </>
  );
}
