"use client";

import { useState, useEffect, useRef } from "react";

const slides = [
  {
    badge: "Secure. Simple. Yours.",
    title: "Your vault for every policy,",
    titleAccent: "every moment.",
    description: "InsureVault is where clients and agents come together — securely storing, sharing, and managing insurance documents in one fortified platform.",
    cta: "Access Your Vault",
    bg: "from-[#0a0f1e] via-[#0d1829] to-[#071222]",
    orb1: "#0e4a6e",
    orb2: "#1a6b5c",
  },
  {
    badge: "For Agents & Clients",
    title: "Assign documents.",
    titleAccent: "Empower clients.",
    description: "Agents can upload and assign policies directly to client profiles. Clients get instant, secure access to their complete insurance portfolio.",
    cta: "Start Managing",
    bg: "from-[#080d1a] via-[#0b1520] to-[#040c18]",
    orb1: "#1a3a6b",
    orb2: "#0e5a4a",
  },
  {
    badge: "Zero Paper. Full Protection.",
    title: "Every claim, every renewal,",
    titleAccent: "always at hand.",
    description: "From health to vehicle to life insurance — your entire portfolio lives in one encrypted, beautifully organized digital vault.",
    cta: "Explore InsureVault",
    bg: "from-[#05090f] via-[#0c1722] to-[#08121d]",
    orb1: "#2a4a0f",
    orb2: "#0f3a5e",
  }
];

const stats = [
  { value: "12,000+", label: "Documents Secured" },
  { value: "₹40Cr+", label: "Claims Facilitated" },
  { value: "3,500+", label: "Active Clients" },
  { value: "99.9%", label: "Uptime Guarantee" },
];

const features = [
  { icon: "⬡", title: "Agent Hub", desc: "Full workspace to onboard clients, upload policies, and assign documents with a single click." },
  { icon: "⬡", title: "Client Vault", desc: "Clients see only what's theirs — a clean, read-only view of their assigned insurance documents." },
  { icon: "⬡", title: "Instant Download", desc: "Any document, any device, any time. Download policy copies in seconds." },
  { icon: "⬡", title: "Smart Renewal Alerts", desc: "Never miss a renewal. Automated reminders for every policy in the vault." },
  { icon: "⬡", title: "Claims Tracker", desc: "Real-time claim status visible to both agent and client with full transparency." },
  { icon: "⬡", title: "Family Profiles", desc: "Organize policies under family members — manage your entire household in one place." },
];

export default function InsureVaultHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [countersVisible, setCountersVisible] = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => setCurrentSlide(p => (p + 1) % slides.length), 6500);
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setCountersVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);

    return () => { clearInterval(interval); window.removeEventListener("scroll", onScroll); observer.disconnect(); };
  }, []);

  const slide = slides[currentSlide];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#05090f", color: "#e8edf5", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,700;1,300&family=Playfair+Display:ital,wght@0,700;1,600&family=DM+Mono:wght@400;500&display=swap');
        
        :root {
          --gold: #c9a84c;
          --gold-light: #e8c97a;
          --teal: #2dd4bf;
          --teal-dark: #0d9488;
          --obsidian: #05090f;
          --deep: #0a1221;
          --panel: #0e1828;
          --panel-border: rgba(255,255,255,0.07);
          --text: #e8edf5;
          --muted: #7a8fa8;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .font-display { font-family: 'Playfair Display', serif; }
        .font-mono { font-family: 'DM Mono', monospace; }

        .glass {
          background: rgba(14, 24, 40, 0.7);
          backdrop-filter: blur(20px);
          border: 1px solid var(--panel-border);
        }

        .gold-line {
          background: linear-gradient(90deg, transparent, var(--gold), transparent);
          height: 1px;
        }

        .btn-gold {
          background: linear-gradient(135deg, #c9a84c, #e8c97a, #c9a84c);
          color: #05090f;
          font-weight: 700;
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          padding: 14px 36px;
          border-radius: 2px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .btn-gold:hover { transform: translateY(-1px); box-shadow: 0 8px 32px rgba(201,168,76,0.35); }

        .btn-outline {
          background: transparent;
          color: var(--text);
          font-weight: 700;
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          padding: 14px 36px;
          border-radius: 2px;
          border: 1px solid rgba(255,255,255,0.2);
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .btn-outline:hover { border-color: var(--gold); color: var(--gold); }

        .nav-link {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(232,237,245,0.55);
          text-decoration: none;
          transition: color 0.2s;
        }
        .nav-link:hover { color: var(--gold); }

        .feature-card {
          background: var(--panel);
          border: 1px solid var(--panel-border);
          padding: 40px 36px;
          transition: all 0.35s ease;
          position: relative;
          overflow: hidden;
        }
        .feature-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--gold), transparent);
          transform: scaleX(0);
          transition: transform 0.4s ease;
        }
        .feature-card:hover::before { transform: scaleX(1); }
        .feature-card:hover { border-color: rgba(201,168,76,0.25); transform: translateY(-4px); background: #111e30; }

        .portal-card {
          background: var(--panel);
          border: 1px solid var(--panel-border);
          padding: 64px 56px;
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
        }
        .portal-card:hover { border-color: rgba(201,168,76,0.3); }

        .portal-card .corner-decor {
          position: absolute;
          top: 32px; right: 32px;
          width: 80px; height: 80px;
          border-top: 2px solid rgba(201,168,76,0.3);
          border-right: 2px solid rgba(201,168,76,0.3);
        }

        .stat-num {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.2rem, 4vw, 3.5rem);
          font-weight: 700;
          color: var(--gold-light);
          display: block;
          line-height: 1;
        }

        .section-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--gold);
          font-family: 'DM Mono', monospace;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .section-label::before {
          content: '';
          display: block;
          width: 24px;
          height: 1px;
          background: var(--gold);
        }

        .section-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.2rem, 4vw, 3.8rem);
          font-weight: 700;
          line-height: 1.15;
          color: var(--text);
        }

        .hexagon-icon {
          font-size: 28px;
          color: var(--gold);
          line-height: 1;
        }

        .slide-enter { animation: slideIn 0.9s cubic-bezier(0.16,1,0.3,1) forwards; }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.18;
          pointer-events: none;
        }

        @media (max-width: 768px) {
          .portal-card { padding: 40px 28px; }
          .feature-card { padding: 28px 24px; }
        }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{
        position: "fixed", top: 0, width: "100%", zIndex: 100,
        background: scrolled ? "rgba(5,9,15,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(24px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.05)" : "none",
        transition: "all 0.4s ease",
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px", height: 76, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 40, height: 40,
              background: "linear-gradient(135deg, #c9a84c, #8a6a1e)",
              clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#05090f">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5L12 1z"/>
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "#e8edf5", lineHeight: 1.1 }}>InsureVault</div>
              <div className="font-mono" style={{ fontSize: 8, letterSpacing: "0.25em", color: "#c9a84c", textTransform: "uppercase" }}>Secure Portal</div>
            </div>
          </div>

          {/* Desktop links */}
          <div style={{ display: "flex", alignItems: "center", gap: 40 }} className="desktop-nav">
            <a href="#about" className="nav-link">Our Story</a>
            <a href="#portals" className="nav-link">Portals</a>
            <a href="#features" className="nav-link">Features</a>
            <a href="#why" className="nav-link">Why Us</a>
            <button className="btn-gold" style={{ padding: "11px 28px", fontSize: 10 }}>Client Login</button>
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMobileMenu(!mobileMenu)} style={{ background: "none", border: "1px solid rgba(255,255,255,0.15)", color: "#e8edf5", padding: 10, cursor: "pointer", display: "none" }} id="hamburger">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d={mobileMenu ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}/>
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenu && (
          <div style={{ background: "#05090f", borderTop: "1px solid rgba(255,255,255,0.07)", padding: "24px 32px", display: "flex", flexDirection: "column", gap: 20 }}>
            {["Our Story","Portals","Features","Why Us"].map(l => (
              <a key={l} href="#" className="nav-link" style={{ fontSize: 12, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>{l}</a>
            ))}
            <button className="btn-gold" style={{ width: "100%", marginTop: 8 }}>Client Login</button>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section style={{ minHeight: "100vh", position: "relative", display: "flex", alignItems: "center", overflow: "hidden", background: `linear-gradient(135deg, ${slide.bg.replace("from-","").replace("via-","").replace("to-","").split(" ")[0]} 0%, #0a1221 100%)` }}>
        {/* Orbs */}
        <div className="orb" style={{ width: 600, height: 600, background: slide.orb1, top: "-10%", right: "-5%" }}/>
        <div className="orb" style={{ width: 400, height: 400, background: slide.orb2, bottom: "5%", left: "-5%" }}/>

        {/* Grid pattern */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.03,
          backgroundImage: "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}/>

        {/* Diagonal accent */}
        <div style={{
          position: "absolute", top: "30%", right: "8%",
          width: 2, height: "45%",
          background: "linear-gradient(to bottom, transparent, rgba(201,168,76,0.4), transparent)",
        }}/>
        <div style={{
          position: "absolute", top: "25%", right: "12%",
          width: 1, height: "55%",
          background: "linear-gradient(to bottom, transparent, rgba(201,168,76,0.15), transparent)",
        }}/>

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "120px 32px 80px", position: "relative", zIndex: 2, width: "100%" }}>
          <div key={currentSlide} className="slide-enter" style={{ maxWidth: 760 }}>
            <div className="section-label" style={{ marginBottom: 32 }}>{slide.badge}</div>

            <h1 className="font-display" style={{ fontSize: "clamp(2.8rem, 6vw, 5.5rem)", fontWeight: 700, lineHeight: 1.08, marginBottom: 12, color: "#e8edf5" }}>
              {slide.title}
            </h1>
            <h1 className="font-display" style={{ fontSize: "clamp(2.8rem, 6vw, 5.5rem)", fontWeight: 700, lineHeight: 1.08, marginBottom: 36, fontStyle: "italic", color: "#c9a84c" }}>
              {slide.titleAccent}
            </h1>

            <p style={{ fontSize: "clamp(1rem, 1.5vw, 1.2rem)", color: "#7a8fa8", lineHeight: 1.8, maxWidth: 540, marginBottom: 56, fontWeight: 300 }}>
              {slide.description}
            </p>

            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <button className="btn-gold">{slide.cta}</button>
              <button className="btn-outline">View Features</button>
            </div>
          </div>

          {/* Floating data card */}
          <div className="glass" style={{
            position: "absolute", right: 80, top: "50%", transform: "translateY(-50%)",
            padding: "32px 28px", width: 220,
            display: "none",
          }} id="floatCard">
            <div style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#c9a84c", marginBottom: 20, fontFamily: "'DM Mono',monospace" }}>Vault Activity</div>
            {["Policy uploaded", "Client assigned", "Renewal alert sent", "Document downloaded"].map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: i === 0 ? "#2dd4bf" : i === 1 ? "#c9a84c" : "#7a8fa8", flexShrink: 0 }}/>
                <span style={{ fontSize: 11, color: "#7a8fa8" }}>{t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Slide dots */}
        <div style={{ position: "absolute", bottom: 48, left: 32, display: "flex", gap: 10, zIndex: 10 }}>
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCurrentSlide(i)} style={{
              height: 2, border: "none", cursor: "pointer", transition: "all 0.4s",
              width: i === currentSlide ? 48 : 16,
              background: i === currentSlide ? "#c9a84c" : "rgba(255,255,255,0.2)",
            }}/>
          ))}
        </div>

        {/* Scroll hint */}
        <div style={{ position: "absolute", bottom: 48, right: 32, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 1, height: 48, background: "linear-gradient(to bottom, transparent, rgba(201,168,76,0.5))" }}/>
          <span style={{ fontSize: 9, letterSpacing: "0.3em", color: "#7a8fa8", textTransform: "uppercase", writingMode: "vertical-rl", transform: "rotate(180deg)", fontFamily: "'DM Mono',monospace" }}>Scroll to explore</span>
        </div>
      </section>

      {/* ── QUICK ACTIONS ── */}
      <section style={{ background: "#08111c", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
            {[
              { label: "Policy Download", code: "01", icon: "▤" },
              { label: "Instant Renewal", code: "02", icon: "↺" },
              { label: "Claims Status", code: "03", icon: "◈" },
              { label: "Contact Agent", code: "04", icon: "⌁" },
            ].map((a, i) => (
              <div key={i} style={{
                padding: "36px 32px",
                borderRight: i < 3 ? "1px solid rgba(255,255,255,0.05)" : "none",
                cursor: "pointer",
                transition: "background 0.3s",
                display: "flex", alignItems: "center", gap: 20,
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#0d1828"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <span style={{ fontSize: 22, color: "#c9a84c", flexShrink: 0 }}>{a.icon}</span>
                <div>
                  <div className="font-mono" style={{ fontSize: 8, color: "#c9a84c", letterSpacing: "0.2em", marginBottom: 4 }}>// {a.code}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#e8edf5" }}>{a.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PORTALS ── */}
      <section id="portals" style={{ padding: "120px 0", background: "#05090f" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ textAlign: "center", marginBottom: 80 }}>
            <div className="section-label" style={{ justifyContent: "center", marginBottom: 20 }}>Dedicated Gateways</div>
            <h2 className="section-title">Two portals. <em style={{ color: "#c9a84c" }}>One platform.</em></h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, background: "rgba(255,255,255,0.04)" }}>
            {/* Agent Portal */}
            <div className="portal-card" style={{ background: "#0a1221" }}>
              <div className="corner-decor"/>
              <div className="font-mono" style={{ fontSize: 9, letterSpacing: "0.3em", color: "#c9a84c", marginBottom: 24, textTransform: "uppercase" }}>// Agent Portal</div>
              <h3 className="font-display" style={{ fontSize: "clamp(1.8rem, 3vw, 2.8rem)", fontWeight: 700, color: "#e8edf5", marginBottom: 24, lineHeight: 1.2 }}>
                The Agent<br/>Workspace
              </h3>
              <div className="gold-line" style={{ marginBottom: 32 }}/>
              <p style={{ color: "#7a8fa8", lineHeight: 1.9, fontSize: 15, marginBottom: 48, fontWeight: 300 }}>
                Full administrative control. Upload policies, build client profiles, assign documents to individuals or family groups, and track every interaction in your vault.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 56 }}>
                {["Upload & assign documents", "Manage client family trees", "Track claims & renewals", "Bulk policy operations"].map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 16, height: 1, background: "#c9a84c", flexShrink: 0 }}/>
                    <span style={{ fontSize: 12, color: "#a0b0c5", letterSpacing: "0.05em" }}>{f}</span>
                  </div>
                ))}
              </div>
              <button className="btn-gold">Enter Agent Hub →</button>
            </div>

            {/* Client Portal */}
            <div className="portal-card" style={{ background: "#080f1a" }}>
              <div className="corner-decor" style={{ borderColor: "rgba(45,212,191,0.25)" }}/>
              <div className="font-mono" style={{ fontSize: 9, letterSpacing: "0.3em", color: "#2dd4bf", marginBottom: 24, textTransform: "uppercase" }}>// Client Portal</div>
              <h3 className="font-display" style={{ fontSize: "clamp(1.8rem, 3vw, 2.8rem)", fontWeight: 700, color: "#e8edf5", marginBottom: 24, lineHeight: 1.2 }}>
                Your Secure<br/>Vault View
              </h3>
              <div style={{ background: "linear-gradient(90deg, transparent, #2dd4bf, transparent)", height: 1, marginBottom: 32 }}/>
              <p style={{ color: "#7a8fa8", lineHeight: 1.9, fontSize: 15, marginBottom: 48, fontWeight: 300 }}>
                A beautifully clean, read-only window into your insurance life. See every policy your agent has assigned, download documents, and track claim status — all secured by your credentials.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 56 }}>
                {["View assigned policies", "Download documents instantly", "Track claim progress", "Family profile overview"].map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 16, height: 1, background: "#2dd4bf", flexShrink: 0 }}/>
                    <span style={{ fontSize: 12, color: "#a0b0c5", letterSpacing: "0.05em" }}>{f}</span>
                  </div>
                ))}
              </div>
              <button style={{
                background: "transparent", color: "#2dd4bf",
                fontWeight: 700, fontSize: 11, letterSpacing: "0.2em",
                textTransform: "uppercase", padding: "14px 36px",
                border: "1px solid rgba(45,212,191,0.45)", cursor: "pointer",
                transition: "all 0.3s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(45,212,191,0.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
              >
                Access Your Vault →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section ref={statsRef} style={{ padding: "100px 0", background: "#0a1221", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.025, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 59px, rgba(201,168,76,0.5) 60px), repeating-linear-gradient(90deg, transparent, transparent 59px, rgba(201,168,76,0.5) 60px)" }}/>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px", position: "relative", zIndex: 1 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 0 }}>
            {stats.map((s, i) => (
              <div key={i} style={{
                padding: "48px 32px",
                textAlign: "center",
                borderRight: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none",
              }}>
                <span className="stat-num" style={{ marginBottom: 12 }}>{countersVisible ? s.value : "—"}</span>
                <div className="font-mono" style={{ fontSize: 9, letterSpacing: "0.3em", color: "#7a8fa8", textTransform: "uppercase" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding: "120px 0", background: "#05090f" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 80, flexWrap: "wrap", gap: 32 }}>
            <div>
              <div className="section-label" style={{ marginBottom: 20 }}>Platform Features</div>
              <h2 className="section-title">Everything you need,<br/><em style={{ color: "#c9a84c" }}>nothing you don't.</em></h2>
            </div>
            <p style={{ color: "#7a8fa8", maxWidth: 380, lineHeight: 1.8, fontSize: 14, fontWeight: 300 }}>
              Built for insurance professionals and their clients. Every feature is designed to reduce friction and increase trust.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, background: "rgba(255,255,255,0.03)" }}>
            {features.map((f, i) => (
              <div key={i} className="feature-card">
                <div style={{ fontSize: 10, fontFamily: "'DM Mono',monospace", color: "#c9a84c", letterSpacing: "0.3em", marginBottom: 28 }}>// 0{i+1}</div>
                <h4 style={{ fontSize: 18, fontWeight: 700, color: "#e8edf5", marginBottom: 16, letterSpacing: "-0.01em" }}>{f.title}</h4>
                <div className="gold-line" style={{ marginBottom: 20, opacity: 0.4 }}/>
                <p style={{ color: "#7a8fa8", lineHeight: 1.8, fontSize: 13, fontWeight: 300 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY US ── */}
      <section id="why" style={{ padding: "120px 0", background: "#080f1a" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 120, alignItems: "center" }}>
            <div>
              <div className="section-label" style={{ marginBottom: 24 }}>Why InsureVault</div>
              <h2 className="section-title" style={{ marginBottom: 48 }}>
                Built on trust,<br/>
                <em style={{ color: "#c9a84c" }}>secured by design.</em>
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
                {[
                  { title: "Agent-to-Client Assignment", body: "The only platform where agents directly assign documents to clients — no middlemen, no confusion." },
                  { title: "Bank-Grade Security", body: "Every document encrypted at rest and in transit. Your vault is as secure as your bank account." },
                  { title: "Instant Digital Access", body: "No more calling your agent for a copy. Every policy is one tap away, 24/7." },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 24 }}>
                    <div style={{ flexShrink: 0 }}>
                      <div style={{ width: 36, height: 36, border: "1px solid rgba(201,168,76,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span className="font-mono" style={{ fontSize: 10, color: "#c9a84c" }}>0{i+1}</span>
                      </div>
                    </div>
                    <div>
                      <h5 style={{ fontSize: 14, fontWeight: 700, color: "#e8edf5", marginBottom: 10, letterSpacing: "0.03em" }}>{item.title}</h5>
                      <p style={{ fontSize: 13, color: "#7a8fa8", lineHeight: 1.8, fontWeight: 300 }}>{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* About / founder card */}
            <div id="about" style={{ position: "relative" }}>
              <div style={{
                background: "#0a1221",
                border: "1px solid rgba(255,255,255,0.07)",
                padding: "56px 48px",
                position: "relative",
              }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, #c9a84c, transparent)" }}/>
                <div className="font-mono" style={{ fontSize: 9, color: "#c9a84c", letterSpacing: "0.3em", marginBottom: 32, textTransform: "uppercase" }}>// Founder's Note</div>
                <blockquote className="font-display" style={{ fontSize: "clamp(1.2rem, 2vw, 1.6rem)", fontStyle: "italic", color: "#c9a84c", lineHeight: 1.5, marginBottom: 32, fontWeight: 600 }}>
                  "I built InsureVault because every client deserves to know exactly what protection they have — and every agent deserves tools that let them deliver on that promise."
                </blockquote>
                <div className="gold-line" style={{ marginBottom: 32 }}/>
                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                  <div style={{
                    width: 56, height: 56,
                    background: "linear-gradient(135deg, #c9a84c, #8a6a1e)",
                    clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 16, fontFamily: "'Playfair Display',serif", fontWeight: 700, color: "#05090f",
                  }}>SK</div>
                  <div>
                    <div style={{ fontWeight: 700, color: "#e8edf5", fontSize: 14, letterSpacing: "0.05em" }}>Sampath Kumar R</div>
                    <div className="font-mono" style={{ fontSize: 9, color: "#7a8fa8", letterSpacing: "0.2em", marginTop: 4 }}>Principal Consultant & Founder · 15+ Years</div>
                  </div>
                </div>
              </div>
              {/* Decorative offset box */}
              <div style={{ position: "absolute", bottom: -12, right: -12, width: "100%", height: "100%", border: "1px solid rgba(201,168,76,0.12)", zIndex: -1 }}/>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BAND ── */}
      <section style={{ padding: "100px 0", background: "linear-gradient(135deg, #0e1a2e 0%, #0a1221 50%, #0c1930 100%)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 300, background: "#c9a84c", borderRadius: "50%", filter: "blur(140px)", opacity: 0.04 }}/>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 32px", textAlign: "center", position: "relative", zIndex: 1 }}>
          <div className="section-label" style={{ justifyContent: "center", marginBottom: 24 }}>Get Started Today</div>
          <h2 className="font-display" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 700, color: "#e8edf5", marginBottom: 24, lineHeight: 1.15 }}>
            Your policies deserve a<br/><em style={{ color: "#c9a84c" }}>vault worthy of them.</em>
          </h2>
          <p style={{ color: "#7a8fa8", fontSize: 15, lineHeight: 1.8, marginBottom: 48, fontWeight: 300 }}>
            Join thousands of clients and agents already using InsureVault to simplify, secure, and streamline insurance management.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn-gold" style={{ padding: "16px 48px" }}>Open Your Vault</button>
            <button className="btn-outline" style={{ padding: "16px 48px" }}>Agent Sign Up</button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#030609", borderTop: "1px solid rgba(255,255,255,0.05)", padding: "80px 0 40px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 64, marginBottom: 64, paddingBottom: 64, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
                <div style={{ width: 36, height: 36, background: "linear-gradient(135deg, #c9a84c, #8a6a1e)", clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#05090f"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5L12 1z"/></svg>
                </div>
                <span className="font-display" style={{ fontSize: 20, fontWeight: 700, color: "#e8edf5" }}>InsureVault</span>
              </div>
              <p style={{ color: "#4a5a6e", fontSize: 13, lineHeight: 1.9, maxWidth: 320, fontWeight: 300 }}>
                The secure bridge between insurance agents and their clients. Documents assigned, accessed, and organized — beautifully.
              </p>
            </div>
            {[
              { title: "Platform", links: ["Agent Hub", "Client Vault", "Pricing", "Security"] },
              { title: "Insurance", links: ["Health", "Life", "Vehicle", "Wealth"] },
              { title: "Company", links: ["About", "Contact", "Privacy", "Terms"] },
            ].map(col => (
              <div key={col.title}>
                <div className="font-mono" style={{ fontSize: 9, letterSpacing: "0.3em", color: "#c9a84c", textTransform: "uppercase", marginBottom: 24 }}>{col.title}</div>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 14 }}>
                  {col.links.map(l => (
                    <li key={l}><a href="#" style={{ color: "#4a5a6e", fontSize: 12, textDecoration: "none", letterSpacing: "0.05em", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "#c9a84c"} onMouseLeave={e => e.currentTarget.style.color = "#4a5a6e"}>{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <p className="font-mono" style={{ fontSize: 9, color: "#3a4a5e", letterSpacing: "0.2em", textTransform: "uppercase" }}>© 2026 InsureVault. All Rights Reserved.</p>
            <p className="font-mono" style={{ fontSize: 9, color: "#3a4a5e", letterSpacing: "0.2em", textTransform: "uppercase" }}>
              Crafted by <a href="https://auxacode.com" style={{ color: "#c9a84c", textDecoration: "none" }}>Auxacode Technologies</a>
            </p>
          </div>
        </div>
      </footer>

      {/* Responsive tweaks */}
      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          #hamburger { display: block !important; }
          #portals > div > div:last-child { grid-template-columns: 1fr !important; }
          #features > div > div:last-child { grid-template-columns: 1fr 1fr !important; }
          #why > div > div { grid-template-columns: 1fr !important; gap: 60px !important; }
          footer > div > div:first-child { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 600px) {
          #features > div > div:last-child { grid-template-columns: 1fr !important; }
          footer > div > div:first-child { grid-template-columns: 1fr !important; }
          section > div > div { gap: 2px !important; }
        }
      `}</style>
    </div>
  );
}