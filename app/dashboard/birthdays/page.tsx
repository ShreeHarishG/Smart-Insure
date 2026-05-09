"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface BirthdayItem { 
  name: string; 
  date_of_birth: string; 
  relationship: string; 
  phone?: string; 
  client_name?: string; 
  client_id: string; 
  type: string; 
}

interface Stats { today: number; thisWeek: number; thisMonth: number; total: number; }

const GREETING_TEMPLATES = [
  { 
    id: "classic", 
    name: "Classic Heritage", 
    bg: "bg-navy", 
    text: "text-white", 
    accent: "bg-secondary",
    message: "Wishing you a spectacular birthday filled with joy and prosperity. May your year ahead be as wonderful as you are."
  },
  { 
    id: "modern", 
    name: "Modern Bright", 
    bg: "bg-white", 
    text: "text-navy", 
    accent: "bg-primary",
    message: "Cheers to another trip around the sun! Wishing you health, wealth, and happiness on your special day."
  },
  { 
    id: "celebration", 
    name: "Festive Joy", 
    bg: "bg-indigo-500", 
    text: "text-white", 
    accent: "bg-amber-400",
    message: "It's time to celebrate YOU! Wishing you the happiest of birthdays and a magnificent year ahead."
  }
];

export default function BirthdaysPage() {
  const [birthdays, setBirthdays] = useState<BirthdayItem[]>([]);
  const [stats, setStats] = useState<Stats>({ today: 0, thisWeek: 0, thisMonth: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("month");
  
  // Greeting Modal State
  const [selectedPerson, setSelectedPerson] = useState<BirthdayItem | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState(GREETING_TEMPLATES[0]);
  const [customMessage, setCustomMessage] = useState("");

  useEffect(() => { fetchBirthdays(); }, [range]);

  async function fetchBirthdays() {
    setLoading(true);
    try {
      const res = await fetch(`/api/birthdays?range=${range}`);
      const data = await res.json();
      setBirthdays(data.birthdays || []);
      if (data.stats) setStats(data.stats);
    } catch {} finally { setLoading(false); }
  }

  const getNextBday = (dob: string) => { 
    const b = new Date(dob), n = new Date(); 
    const t = new Date(n.getFullYear(), b.getMonth(), b.getDate()); 
    const next = t >= n ? t : new Date(n.getFullYear() + 1, b.getMonth(), b.getDate()); 
    return next.toLocaleDateString("en-IN", { day: "numeric", month: "short" }); 
  };
  
  const getAge = (dob: string) => { 
    const b = new Date(dob), n = new Date(); 
    let a = n.getFullYear() - b.getFullYear(); 
    if (n.getMonth() < b.getMonth() || (n.getMonth() === b.getMonth() && n.getDate() < b.getDate())) a--; 
    return a + 1; 
  };
  
  const daysUntil = (dob: string) => { 
    const b = new Date(dob), n = new Date(); 
    n.setHours(0,0,0,0); 
    const t = new Date(n.getFullYear(), b.getMonth(), b.getDate()); 
    const next = t >= n ? t : new Date(n.getFullYear() + 1, b.getMonth(), b.getDate()); 
    return Math.ceil((next.getTime() - n.getTime()) / 86400000); 
  };

  const handleOpenGreeting = (person: BirthdayItem) => {
    setSelectedPerson(person);
    setCustomMessage(`Happy Birthday ${person.name}! ${selectedTemplate.message}`);
  };

  const sendWhatsApp = () => {
    if (!selectedPerson || !selectedPerson.phone) return;
    const phone = selectedPerson.phone.replace(/\s/g, "");
    const text = encodeURIComponent(`${customMessage}\n\n- With Regards,\nSampath Kumar\nMaruthi Insure Care`);
    window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
  };

  return (
    <>
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 animate-in fade-in slide-in-from-left-4 duration-500">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-navy mb-2 italic">Birthday <span className="text-primary not-italic">Outreach</span></h1>
          <p className="text-slate-500 font-medium flex items-center gap-2"><span className="text-amber-500 text-xl">🎊</span> Personalize your greetings and send them directly to clients.</p>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-in fade-in zoom-in-95 duration-500 delay-200">
        {[
          { label: "Today's Events", value: stats.today, icon: "📆", cls: "bg-white border-slate-100", valCls: "text-navy" },
          { label: "Next 7 Days", value: stats.thisWeek, icon: "✨", cls: "bg-gradient-to-br from-primary to-primary-light text-white shadow-2xl shadow-primary/30", valCls: "text-white" },
          { label: "Monthly Total", value: stats.thisMonth, icon: "🍰", cls: "bg-white border-primary/20", valCls: "text-primary" },
          { label: "All People", value: stats.total, icon: "🎈", cls: "bg-white border-slate-100", valCls: "text-emerald-600" },
        ].map(s => (
          <div key={s.label} className={`p-8 rounded-xl ${s.cls} border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden relative`}>
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">{s.icon}</div>
              <h3 className={`text-3xl font-black leading-none ${s.valCls}`}>{loading ? "—" : s.value}</h3>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] mt-3 opacity-60">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* List Content */}
      <div className="flex gap-2 mb-8 p-1 bg-slate-50 rounded-2xl border border-slate-100 w-fit">
        {[{ id: "week", label: "This Week" }, { id: "month", label: "This Month" }, { id: "all", label: "All" }].map(f => (
          <button key={f.id} onClick={() => setRange(f.id)} className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${range === f.id ? "bg-white text-primary shadow-sm border border-slate-100" : "text-slate-400 hover:text-navy"}`}>{f.label}</button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <h2 className="text-xl font-black text-navy uppercase tracking-tight">Celebration List</h2>
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary"></span><span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Automated Alerts</span></div>
        </div>

        <div className="divide-y divide-slate-50">
          {loading ? (
            <div className="py-20 text-center"><div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div><p className="text-slate-400 font-medium">Syncing calendars...</p></div>
          ) : birthdays.length === 0 ? (
            <div className="py-20 text-center"><span className="text-4xl block mb-4">🎂</span><p className="text-slate-400 font-bold">No birthdays found</p></div>
          ) : birthdays.map((person, i) => {
            const days = daysUntil(person.date_of_birth);
            const bdayParts = getNextBday(person.date_of_birth).split(" ");
            return (
              <div key={person.name + i} className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50/50 transition-all group">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 flex flex-col items-center justify-center shadow-sm group-hover:scale-110 transition-transform overflow-hidden">
                    <div className="w-full bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest text-center py-1">{bdayParts[1]}</div>
                    <div className="flex-1 flex items-center justify-center text-xl font-black text-navy leading-none pb-0.5">{bdayParts[0]}</div>
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-navy group-hover:text-primary transition-colors">{person.name}</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                      {person.relationship} • Turning {getAge(person.date_of_birth)}
                      {person.client_name && ` • Client: ${person.client_name}`}
                    </p>
                    <p className={`text-[10px] font-bold mt-1 ${days === 0 ? "text-amber-500 animate-pulse" : "text-primary"}`}>
                      {days === 0 ? "🎂 TODAY!" : days === 1 ? "Tomorrow" : `In ${days} days`}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => handleOpenGreeting(person)}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-white font-black text-sm shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all active:scale-95"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                  Send WhatsApp Wish
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Greeting Designer Modal */}
      {selectedPerson && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12">
          <div className="absolute inset-0 bg-navy/60 backdrop-blur-xl" onClick={() => setSelectedPerson(null)}></div>
          <div className="bg-white w-full max-w-5xl rounded-xl shadow-3xl relative z-10 overflow-hidden flex flex-col lg:flex-row animate-in zoom-in-95 duration-300">
            {/* Left: Designer Sidebar */}
            <div className="lg:w-1/3 p-8 md:p-12 bg-slate-50 border-r border-slate-100 flex flex-col h-full">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-2xl font-black text-navy italic">Greeting <span className="text-primary not-italic">Designer</span></h3>
                <button onClick={() => setSelectedPerson(null)} className="p-2 hover:bg-slate-200 rounded-full">✕</button>
              </div>
              
              <div className="space-y-8 flex-1">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Select Template</label>
                  <div className="grid grid-cols-1 gap-2">
                    {GREETING_TEMPLATES.map(t => (
                      <button 
                        key={t.id} 
                        onClick={() => {
                          setSelectedTemplate(t);
                          setCustomMessage(`Happy Birthday ${selectedPerson.name}! ${t.message}`);
                        }}
                        className={`w-full p-4 rounded-2xl border transition-all flex items-center gap-3 ${selectedTemplate.id === t.id ? "bg-white border-primary shadow-sm" : "border-slate-200 hover:border-slate-300"}`}
                      >
                        <div className={`w-8 h-8 rounded-lg ${t.bg}`}></div>
                        <span className="font-bold text-sm text-navy">{t.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Personalize Message</label>
                  <textarea 
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    className="w-full h-32 p-4 rounded-2xl bg-white border border-slate-200 focus:border-primary outline-none text-sm font-medium text-navy resize-none"
                  />
                </div>
              </div>

              <div className="pt-8 space-y-4">
                <button 
                  onClick={sendWhatsApp}
                  className="w-full py-5 bg-emerald-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                  Send via WhatsApp
                </button>
              </div>
            </div>

            {/* Right: Live Preview */}
            <div className="flex-1 bg-slate-200 p-8 md:p-20 flex items-center justify-center">
              <div className={`w-full max-w-lg aspect-[4/5] ${selectedTemplate.bg} rounded-3xl shadow-3xl p-12 flex flex-col items-center text-center relative overflow-hidden`}>
                <div className={`absolute top-0 right-0 w-64 h-64 ${selectedTemplate.accent} opacity-20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2`}></div>
                
                <div className="mt-12 mb-8">
                  <div className={`w-24 h-24 rounded-3xl ${selectedTemplate.accent} flex items-center justify-center text-4xl shadow-2xl animate-bounce-slow mx-auto`}>🎂</div>
                </div>
                
                <h2 className={`text-4xl font-black font-cormorant italic mb-8 ${selectedTemplate.text}`}>Happy Birthday</h2>
                
                <div className="space-y-4 mb-12">
                   <div className={`text-5xl font-black tracking-tight ${selectedTemplate.text}`}>{selectedPerson.name}</div>
                   <div className={`text-[10px] font-black uppercase tracking-[0.4em] opacity-60 ${selectedTemplate.text}`}>Turning {getAge(selectedPerson.date_of_birth)} Years</div>
                </div>

                <p className={`text-lg font-medium leading-relaxed italic max-w-xs ${selectedTemplate.text} opacity-80`}>
                  "{customMessage.split('! ')[1] || selectedTemplate.message}"
                </p>

                <div className="mt-auto pt-12 border-t border-white/10 w-full">
                  <div className={`text-xs font-black uppercase tracking-[0.3em] ${selectedTemplate.text}`}>Maruthi Insure Care</div>
                  <div className={`text-[8px] font-bold uppercase tracking-widest mt-1 opacity-40 ${selectedTemplate.text}`}>Heritage of trust since 2011</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
