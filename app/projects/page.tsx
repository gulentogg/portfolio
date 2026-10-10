"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { playMinecraftClick } from "../utils/sound";

export default function ProjectsPage() {
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [blockDelays, setBlockDelays] = useState<number[]>([]);

  const vaults = [
    {
      id: "python",
      name: "PYTHON VAULT",
      icon: "🐍",
      desc: "POS & ADMIN MANAGEMENT",
      link: "/projects/python",
      available: true,
      activeClasses: "border-blue-600/60 hover:border-blue-400 hover:bg-[#1f2937] text-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.2)] hover:shadow-[0_0_25px_rgba(59,130,246,0.4)]",
    },
    {
      id: "java",
      name: "JAVA VAULT",
      icon: "☕",
      desc: "OOP & CONSOLE APPS",
      link: "/projects/java",
      available: true,
      activeClasses: "border-orange-600/60 hover:border-orange-400 hover:bg-[#1f2937] text-orange-400 shadow-[0_0_15px_rgba(234,88,12,0.2)] hover:shadow-[0_0_25px_rgba(249,115,22,0.4)]",
    },
    {
      id: "javascript",
      name: "JAVASCRIPT VAULT",
      icon: "⚡",
      desc: "WEB & INTERACTIVE",
      link: "#",
      available: false,
      activeClasses: "border-slate-800 text-slate-600 bg-[#0a0f1a]",
    },
    {
      id: "cpp",
      name: "C++ VAULT",
      icon: "⚙️",
      desc: "SYSTEM & ALGORITHMS",
      link: "#",
      available: false,
      activeClasses: "border-slate-800 text-slate-600 bg-[#0a0f1a]",
    }
  ];

  useEffect(() => {
    // สร้างดีเลย์สุ่มสำหรับเอฟเฟกต์บล็อกแตก 120 ก้อน
    const delays = Array.from({ length: 120 }).map(() => Math.random() * 0.5);
    setBlockDelays(delays);
    setIsFirstLoad(true);
    const timer = setTimeout(() => setIsFirstLoad(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#030712] font-rpg relative overflow-hidden">
      
      {/* เอฟเฟกต์บล็อกถล่มตอนโหลดหน้า */}
      {isFirstLoad && blockDelays.length > 0 && (
        <div className="fixed inset-0 z-50 flex flex-wrap pointer-events-none overflow-hidden">
          {blockDelays.map((delay, i) => (
            <div
              key={i}
              className="w-[10vw] h-[10vh] bg-[#334155] border-4 border-[#1e293b] flex items-center justify-center relative shadow-md"
              style={{ animation: `blockBreak 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards`, animationDelay: `${delay}s` }}
            >
              <div className="absolute top-1 left-1 w-2 h-2 bg-[#1e293b] opacity-60"></div>
              <div className="absolute bottom-2 right-2 w-3 h-2 bg-[#1e293b] opacity-50"></div>
            </div>
          ))}
        </div>
      )}

      {/* ปุ่มย้อนกลับ */}
      <Link 
        href="/"
        onClick={playMinecraftClick}
        className="absolute top-6 left-6 z-30 px-4 py-2 bg-[#181820] border-2 border-slate-500 text-slate-300 rounded font-pixel text-xs flex items-center gap-2 hover:bg-[#1e293b] shadow-[0_0_10px_rgba(100,116,139,0.3)] transition-all active:scale-95"
      >
        <span>◀ BACK TO HOME</span>
      </Link>

      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <div className="relative z-10 text-center mb-12 mt-12 md:mt-0">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 font-pixel drop-shadow-[4px_4px_0px_#000]">
          SELECT TECH STACK
        </h1>
        <p className="text-sm text-slate-400 font-pixel tracking-widest">
          [ CHOOSE YOUR VAULT TO PROCEED ]
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl relative z-10">
        {vaults.map((vault) => {
          if (vault.available) {
            return (
              <Link
                key={vault.id}
                href={vault.link}
                onClick={playMinecraftClick}
                className={`relative flex flex-col items-center justify-center p-8 rounded-lg border-4 transition-all duration-300 active:scale-95 bg-[#111827]/80 backdrop-blur ${vault.activeClasses}`}
              >
                <span className="text-5xl mb-4 drop-shadow-lg">{vault.icon}</span>
                <h2 className="text-xl font-bold font-pixel mb-2 text-center">{vault.name}</h2>
                <p className="text-xs text-slate-300 font-rpg tracking-wide text-center">{vault.desc}</p>
                <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e] animate-pulse"></div>
              </Link>
            );
          }

          return (
            <div
              key={vault.id}
              className={`relative flex flex-col items-center justify-center p-8 rounded-lg border-4 transition-all duration-300 cursor-not-allowed group ${vault.activeClasses}`}
            >
              <div className="opacity-40 flex flex-col items-center transition-opacity duration-300 group-hover:opacity-10">
                <span className="text-5xl mb-4 grayscale">{vault.icon}</span>
                <h2 className="text-xl font-bold font-pixel mb-2 text-center">{vault.name}</h2>
                <p className="text-xs font-rpg tracking-wide text-center">{vault.desc}</p>
              </div>
              
              <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-red-600 shadow-[0_0_8px_#dc2626]"></div>

              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="bg-red-950/90 border-2 border-red-500 px-6 py-3 rounded shadow-[0_0_20px_rgba(220,38,38,0.5)] transform scale-90 group-hover:scale-100 transition-transform duration-300">
                  <span className="text-red-400 font-pixel text-sm sm:text-base drop-shadow-[2px_2px_0px_#000]">
                    🔒 COMING SOON
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Prompt:wght@300;400;600&display=swap');
        .font-pixel { font-family: 'Press Start 2P', monospace; }
        .font-rpg { font-family: 'Prompt', sans-serif; }
        @keyframes blockBreak {
          0% { transform: scale(1) rotate(0deg); opacity: 1; filter: brightness(1); }
          100% { transform: scale(0.2) translateY(80px) rotate(15deg); opacity: 0; filter: brightness(0.3); }
        }
      `}</style>
    </main>
  );
}