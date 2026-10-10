"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  playMinecraftClick, 
  playShootingStarSound, 
  playMoonSound, 
  playWindSound, 
  playFireflySound,
  playWarpWindSound
} from "./utils/sound";

export default function Home() {
  const router = useRouter();
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isWarping, setIsWarping] = useState(false);
  const [blockDelays, setBlockDelays] = useState<number[]>([]);
  const [eventMode, setEventMode] = useState<number>(0);
  const [stars, setStars] = useState<{ id: number; top: string; left: string; delay: string }[]>([]);
  const [fireflies, setFireflies] = useState<{ id: number; top: string; left: string; size: string; duration: string }[]>([]);

  useEffect(() => {
    // สุ่มค่าดีเลย์ของบล็อกดินฝั่ง Client เพื่อแก้ปัญหา Next.js Prerender Error
    const delays = Array.from({ length: 120 }).map(() => Math.random() * 0.5);
    setBlockDelays(delays);

    setIsWarping(false);
    setIsFirstLoad(true);
    
    const timer = setTimeout(() => {
      setIsFirstLoad(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const mode = Math.floor(Math.random() * 4) + 1; 
      setEventMode(mode);

      if (mode === 1) {
        const count = Math.floor(Math.random() * 2) + 1;
        const newStars = Array.from({ length: count }).map((_, i) => ({
          id: Date.now() + i,
          top: Math.random() * 30 + "%",
          left: Math.random() * 30 + 60 + "%",
          delay: Math.random() * 0.3 + "s"
        }));
        setStars(newStars);
        playShootingStarSound();
      } else if (mode === 2) {
        playMoonSound();
      } else if (mode === 3) {
        playWindSound();
      } else if (mode === 4) {
        const newFireflies = Array.from({ length: 10 }).map((_, i) => ({
          id: Date.now() + i,
          top: Math.random() * 70 + 20 + "%",
          left: Math.random() * 80 + 10 + "%",
          size: Math.random() * 4 + 3 + "px",
          duration: Math.random() * 2 + 2 + "s"
        }));
        setFireflies(newFireflies);
        playFireflySound();
      }

      const timeout = setTimeout(() => {
        setEventMode(0);
      }, 4500);

      return () => clearTimeout(timeout);

    }, 8500);

    return () => clearInterval(interval);
  }, []);

  // ฟังก์ชันวาร์ปไปยังหน้าที่ต้องการ (ใช้ร่วมกันได้ทั้งไป Projects และ About)
  const handleWarp = (targetPath: string) => {
    playMinecraftClick();
    playWarpWindSound();
    setIsWarping(true);
    
    setTimeout(() => {
      router.push(targetPath);
    }, 1200);
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[#050814]">
      
      {/* ⛏️ เอฟเฟกต์บล็อกดินสลายตัวทุกครั้งที่เข้าหน้าแรก */}
      {isFirstLoad && blockDelays.length > 0 && (
        <div className="fixed inset-0 z-50 flex flex-wrap pointer-events-none overflow-hidden">
          {blockDelays.map((delay, i) => (
            <div
              key={i}
              className="w-[10vw] h-[10vh] bg-[#79553a] border-4 border-[#5c3a21] flex items-center justify-center relative shadow-md"
              style={{
                animation: `blockBreak 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards`,
                animationDelay: `${delay}s`,
              }}
            >
              <div className="absolute top-1 left-1 w-2 h-2 bg-[#5c3a21] opacity-60"></div>
              <div className="absolute bottom-2 right-2 w-3 h-2 bg-[#5c3a21] opacity-50"></div>
              <div className="absolute top-3 right-4 w-1 h-1 bg-[#472c19] opacity-70"></div>
            </div>
          ))}
        </div>
      )}

      {/* พื้นหลังสุ่มเหตุการณ์ */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-16 right-24 w-16 h-16 bg-[#fef08a] rounded-full shadow-[0_0_35px_rgba(254,240,138,0.6)] transition-all duration-[3000ms] ${eventMode === 2 ? '-translate-y-12 scale-110' : 'translate-y-0'}`}></div>

        {eventMode === 1 && stars.map((star) => (
          <div
            key={star.id}
            className="absolute h-[3px] w-[180px] bg-gradient-to-l from-white via-cyan-200 to-transparent rounded-full shadow-[0_0_12px_#ffffff] z-10 animate-[shootingStarRightToLeft_1s_ease-out_forwards]"
            style={{ top: star.top, left: star.left, animationDelay: star.delay }}
          />
        ))}

        {eventMode === 3 && Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute h-[1px] w-[120px] bg-gradient-to-l from-transparent via-white/40 to-transparent rounded-full animate-[windBlow_0.8s_linear_infinite]"
            style={{ top: Math.random() * 80 + "%", left: "100%", animationDelay: `${i * 0.15}s` }}
          />
        ))}

        {eventMode === 4 && fireflies.map((ff) => (
          <div
            key={ff.id}
            className="absolute rounded-full bg-emerald-300 shadow-[0_0_8px_#34d399] animate-[fireflyFloat_3s_ease-in-out_infinite]"
            style={{ top: ff.top, left: ff.left, width: ff.size, height: ff.size, animationDuration: ff.duration }}
          />
        ))}

        {isWarping && Array.from({ length: 25 }).map((_, i) => (
          <div
            key={i}
            className="absolute h-[2px] w-[200px] bg-gradient-to-l from-transparent via-white to-transparent rounded-full animate-[warpWindStream_0.6s_ease-in_forwards]"
            style={{
              top: Math.random() * 100 + "%",
              left: "100%",
              animationDelay: `${Math.random() * 0.3}s`
            }}
          />
        ))}
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Prompt:wght@300;400;600&display=swap');

        .font-pixel { font-family: 'Press Start 2P', monospace; }
        .font-rpg { font-family: 'Prompt', sans-serif; }

        @keyframes blockBreak {
          0% { transform: scale(1) rotate(0deg); opacity: 1; filter: brightness(1); }
          30% { transform: scale(1.08) rotate(3deg); opacity: 1; filter: brightness(0.9); }
          60% { transform: scale(1.05) rotate(-3deg); opacity: 0.9; filter: brightness(0.7); }
          100% { transform: scale(0.2) translateY(80px) rotate(15deg); opacity: 0; filter: brightness(0.3); }
        }

        @keyframes subtleFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-4px) rotate(0.5deg); }
        }

        @keyframes uiWarpFlyAway {
          0% { transform: scale(1) translateY(0) rotate(0deg); opacity: 1; filter: blur(0px); }
          30% { transform: scale(1.05) translateY(-20px) rotate(-2deg); opacity: 0.9; filter: blur(0px); }
          100% { transform: scale(0.1) translateY(-300px) translateX(-150px) rotate(-25deg); opacity: 0; filter: blur(12px); }
        }

        @keyframes rareGlowInner {
          0% { border-color: #3b82f6; box-shadow: inset 0 0 10px rgba(59,130,246,0.3), 0 0 8px rgba(59,130,246,0.4); }
          33% { border-color: #a855f7; box-shadow: inset 0 0 10px rgba(168,85,247,0.3), 0 0 8px rgba(168,85,247,0.4); }
          66% { border-color: #eab308; box-shadow: inset 0 0 10px rgba(234,179,8,0.3), 0 0 8px rgba(234,179,8,0.4); }
          100% { border-color: #3b82f6; box-shadow: inset 0 0 10px rgba(59,130,246,0.3), 0 0 8px rgba(59,130,246,0.4); }
        }

        @keyframes rareGlowOuter {
          0% { border-color: #10b981; box-shadow: 0 12px 0 #050507, 0 0 15px rgba(16,185,129,0.4); }
          33% { border-color: #ec4899; box-shadow: 0 12px 0 #050507, 0 0 15px rgba(236,72,153,0.4); }
          66% { border-color: #06b6d4; box-shadow: 0 12px 0 #050507, 0 0 15px rgba(6,182,212,0.4); }
          100% { border-color: #10b981; box-shadow: 0 12px 0 #050507, 0 0 15px rgba(16,185,129,0.4); }
        }

        @keyframes shineSweep {
          0% { transform: translateX(-100%) rotate(25deg); }
          100% { transform: translateX(200%) rotate(25deg); }
        }

        @keyframes shootingStarRightToLeft {
          0% { transform: translateX(0) translateY(0) rotate(-35deg); opacity: 1; }
          100% { transform: translateX(-400px) translateY(250px) rotate(-35deg); opacity: 0; }
        }

        @keyframes windBlow {
          0% { transform: translateX(0); opacity: 0; }
          50% { opacity: 0.8; }
          100% { transform: translateX(-100vw); opacity: 0; }
        }

        @keyframes fireflyFloat {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.2; }
          50% { transform: translateY(-25px) translateX(15px); opacity: 1; }
        }

        @keyframes warpWindStream {
          0% { transform: translateX(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(-120vw); opacity: 0; }
        }

        .btn-shine {
          position: relative;
          overflow: hidden;
        }

        .btn-shine::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 50%;
          height: 200%;
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.4) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: rotate(25deg);
          pointer-events: none;
          opacity: 0;
        }

        .btn-shine:hover::after {
          opacity: 1;
          animation: shineSweep 0.8s ease-in-out forwards;
        }

        .animate-rpg-outer {
          animation: subtleFloat 5s ease-in-out infinite, rareGlowOuter 7s linear infinite;
        }

        .animate-rpg-inner {
          animation: rareGlowInner 6s linear infinite;
        }

        .warp-effect {
          animation: uiWarpFlyAway 1.2s cubic-bezier(0.55, 0.085, 0.68, 0.53) forwards;
        }
      `}</style>

      {/* กรอบ UI หลัก */}
      <div className={`max-w-2xl w-full bg-[#181820]/95 backdrop-blur border-4 p-8 rounded relative z-20 font-rpg animate-rpg-outer transition-all ${isWarping ? 'warp-effect' : ''}`}>
        
        <h1 className="text-3xl font-bold text-green-400 mb-2 font-pixel tracking-wider drop-shadow-[2px_2px_0px_#000]">
          JIRAWISH.
        </h1>
        <h2 className="text-sm text-yellow-500 mb-6 font-pixel tracking-widest">
          [ Lv.99 Developer ]
        </h2>

        <div className="bg-[#111116] border-2 p-5 rounded mb-6 relative animate-rpg-inner transition-all">
          <div className="absolute -top-3 left-4 bg-[#2b2b38] px-3 py-0.5 text-xs text-yellow-400 font-pixel border border-[#4a4a5e]">
            STATUS
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm text-slate-300 mb-4 mt-2">
            <div><span className="text-red-500 font-bold font-pixel text-xs">HP:</span> 9999 / 9999</div>
            <div><span className="text-blue-400 font-bold font-pixel text-xs">MP:</span> 500 / 500</div>
            <div><span className="text-green-400 font-bold font-pixel text-xs">CLASS:</span> Full-Stack</div>
            <div><span className="text-purple-400 font-bold font-pixel text-xs">WEAPON:</span> VS Code</div>
          </div>
          
          <div className="border-t border-[#2b2b38] pt-3 mt-3">
            <h4 className="text-xs text-slate-400 mb-2 font-pixel">INVENTORY (TECH STACK)</h4>
            <div className="flex gap-2 flex-wrap">
              {["Next.js", "Tailwind CSS", "TypeScript", "GitHub"].map((tech) => (
                <span 
                  key={tech}
                  onClick={playMinecraftClick}
                  className="px-3 py-1 bg-[#22222e] border border-[#44445c] rounded text-xs text-slate-200 shadow hover:bg-[#2e2e42] cursor-pointer font-semibold transition-transform active:scale-95"
                >
                  {tech}
                </span>
              ))}
              <span className="px-3 py-1 bg-slate-700/50 border border-slate-600 rounded text-xs text-slate-400 shadow">Locked +</span>
            </div>
          </div>
        </div>

        <p className="text-slate-300 leading-relaxed mb-8 text-base font-light border-l-4 border-green-500 pl-4 bg-[#1f1f2b]/40 py-2">
          ยินดีต้อนรับสู่คลังเก็บผลงานของผม ที่นี่รวบรวมโค้ดและโปรเจกต์ต่างๆ 
          ที่คุณสามารถกดรันและดูผลลัพธ์ได้ทันที
        </p>

        {/* ปรับ Layout ปุ่มให้เรียงกันและรองรับหน้าจอมือถือ */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => handleWarp("/projects")}
            disabled={isWarping}
            className="flex-1 px-8 py-4 bg-green-600 text-white font-bold rounded shadow-[0_6px_0_#14532d] hover:bg-green-500 hover:shadow-[0_3px_0_#14532d] hover:translate-y-[3px] active:shadow-none active:translate-y-[6px] transition-all disabled:opacity-55 disabled:cursor-not-allowed cursor-pointer font-pixel text-xs tracking-wider flex items-center justify-center gap-3 btn-shine"
          >
            <span>{isWarping ? "🌪️ WARPING..." : "▶ START ADVENTURE"}</span>
          </button>
          
          <button 
            onClick={() => handleWarp("/about")}
            disabled={isWarping}
            className="flex-1 px-8 py-4 bg-blue-600 text-white font-bold rounded shadow-[0_6px_0_#1e3a8a] hover:bg-blue-500 hover:shadow-[0_3px_0_#1e3a8a] hover:translate-y-[3px] active:shadow-none active:translate-y-[6px] transition-all disabled:opacity-55 disabled:cursor-not-allowed cursor-pointer font-pixel text-xs tracking-wider flex items-center justify-center gap-3 btn-shine"
          >
            <span>📜 ABOUT ME</span>
          </button>
        </div>
        
      </div>
    </main>
  );
}