"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { playMinecraftClick, playPaperUnrollSound, playPaperBurnSound } from "../utils/sound";

export default function AboutQuestPage() {
  const router = useRouter();
  const [isUnrolling, setIsUnrolling] = useState(true);
  const [isBurning, setIsBurning] = useState(false);

  // 📝 ข้อมูลตัวละคร
  const questData = {
    realName: "JIRAWISH THEPTHONG",
    alias: "GULENTO",
    level: 19,
    class: "IT Student (Year 2) @ KMUTNB",
    interests: [
      "💻 Software Development (GitHub, Oracle Cloud, Airtable)",
      "🎮 Immersive Gaming (Minecraft, Valorant, RDR2, GTA V, HoYoverse)",
      "🏍️ Motorcycle Travel & Real-world Quests (Grab Driver Partner)",
      "🎨 Creative & AI Tech (Canva, ZipWP, AI Prompting)"
    ],
    bio: "นักผจญภัยหน้าใหม่ผู้หลงใหลในโลกแห่งโค้ดและการแก้ปัญหา (Problem Solving) เชี่ยวชาญการจัดการทรัพยากรในช่องเก็บของผ่าน GitHub, Oracle Cloud และ Airtable ไม่ว่าจะเป็นการสร้างสรรค์สคริปต์ในโลกดิจิทัล การออกสำรวจโลกกว้างใน Minecraft และ RDR2 หรือการบิดมอเตอร์ไซค์รับเควสต์เสริมในโลกความเป็นจริง เป้าหมายปัจจุบันคือการอัปเลเวลสาย Tech ให้ถึงจุดสุดยอด และพร้อมเผชิญหน้ากับบัก (Bugs) ทุกรูปแบบ!"
  };

  useEffect(() => {
    // 🧠 รีเซ็ตสถานะทุกครั้งที่เปิดหน้า เพื่อป้องกัน Next.js Cache จำค่าเดิม
    setIsBurning(false);
    setIsUnrolling(true);

    // 📜 เล่นเสียงม้วนกระดาษกางออกตอนเริ่มหน้า
    playPaperUnrollSound();

    // จบเอฟเฟกต์ม้วนกระดาษหลังจาก 1.2 วินาที
    const timer = setTimeout(() => setIsUnrolling(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleBackToHome = () => {
    // เล่นเสียงคลิกและเสียงไฟไหม้กระดาษ
    playMinecraftClick();
    playPaperBurnSound();

    setIsBurning(true);
    
    // รอให้เอฟเฟกต์ไฟคลอกทำงานจบ (1.5 วิ) แล้วค่อยเปลี่ยนหน้า
    setTimeout(() => {
      router.push("/");
    }, 1500);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#0a0a0a] font-rpg relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none"></div>

      <button 
        onClick={handleBackToHome}
        disabled={isBurning || isUnrolling}
        className="absolute top-6 left-6 z-30 px-4 py-2 bg-[#181820] border-2 border-slate-500 text-slate-300 rounded font-pixel text-xs flex items-center gap-2 hover:bg-[#1e293b] shadow-[0_0_10px_rgba(100,116,139,0.3)] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span>◀ BACK TO HOME</span>
      </button>

      {/* 📜 ส่วนของม้วนกระดาษเควสต์ */}
      <div className={`relative z-20 w-full max-w-2xl transition-all ${isUnrolling ? 'animate-smoothUnroll' : 'scale-100 opacity-100'} ${isBurning ? 'animate-paperAsh' : ''}`}>
        
        {/* ก้านไม้ม้วนกระดาษด้านบน */}
        <div className="h-6 w-[105%] -ml-[2.5%] bg-gradient-to-b from-[#5c4033] to-[#3e2723] rounded-full shadow-lg border-y border-[#2a1711] relative z-20">
          <div className="absolute top-0 bottom-0 left-0 w-3 bg-[#8d6e63] rounded-full border border-[#3e2723]"></div>
          <div className="absolute top-0 bottom-0 right-0 w-3 bg-[#8d6e63] rounded-full border border-[#3e2723]"></div>
        </div>

        {/* ตัวกระดาษประกาศจับ */}
        <div className="bg-[#f4e4bc] min-h-[600px] w-full shadow-[0_10px_30px_rgba(0,0,0,0.5)] border-x-4 border-[#d4b886] p-8 md:p-12 relative flex flex-col items-center overflow-hidden quest-paper">
          
          {/* ลายน้ำกระดาษเก่า */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/paper.png')] pointer-events-none z-0"></div>
          
          {/* 🔥 คลื่นเปลวไฟตอนกดออก 🔥 */}
          {isBurning && (
            <div className="absolute top-0 left-0 w-full h-[200%] flex flex-col pointer-events-none z-50 animate-fireWave mix-blend-multiply">
              <div className="h-32 w-full bg-gradient-to-t from-red-600 via-orange-500 to-transparent blur-xl"></div>
              <div className="h-32 w-full bg-gradient-to-t from-[#111] to-red-700 blur-lg"></div>
              <div className="flex-1 w-full bg-[#0a0a0a]"></div>
            </div>
          )}

          {/* หัวข้อ WANTED */}
          <h1 className="text-5xl md:text-6xl font-black font-pixel text-[#3e2723] mb-6 tracking-widest drop-shadow-[2px_2px_0px_#a1887f] relative z-10">
            WANTED
          </h1>

          {/* 🖼️ กรอบรูปประกาศจับ (ดึง avatar.jpg มาใส่แล้ว) */}
          <div className="w-48 h-48 md:w-56 md:h-56 border-8 border-[#5c4033] bg-[#d7ccc8] mb-6 shadow-[0_5px_15px_rgba(0,0,0,0.3)] flex items-center justify-center relative overflow-hidden group z-10">
            <img 
              src="/images/avatar.jpg" 
              alt="Avatar" 
              className="w-full h-full object-cover sepia-[0.6] contrast-125 brightness-90 group-hover:sepia-0 group-hover:contrast-100 group-hover:brightness-100 transition-all duration-500" 
            />
            {/* เงาขอบด้านในทับรูปให้ดูเหมือนกระดาษเจาะรู */}
            <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(92,64,51,0.9)] pointer-events-none"></div>
          </div>

          {/* ชื่อและเลเวล */}
          <div className="text-center mb-8 border-b-2 border-[#8d6e63] pb-6 w-full relative z-10">
            <h2 className="text-2xl font-bold font-pixel text-[#3e2723] mb-2">{questData.realName}</h2>
            <h3 className="text-lg font-pixel text-[#5c4033] mb-3">AKA: "{questData.alias}"</h3>
            <div className="inline-block px-4 py-1 bg-[#3e2723] text-[#f4e4bc] font-pixel text-sm rounded shadow-sm">
              LEVEL {questData.level}
            </div>
          </div>

          {/* รายละเอียดเควสต์ */}
          <div className="w-full text-[#3e2723] font-rpg space-y-6 relative z-10">
            <div>
              <h4 className="font-pixel text-sm font-bold text-[#5c4033] mb-2">⚔️ CURRENT CLASS (อาชีพปัจจุบัน)</h4>
              <p className="text-base font-semibold border-l-4 border-[#8d6e63] pl-3">{questData.class}</p>
            </div>
            <div>
              <h4 className="font-pixel text-sm font-bold text-[#5c4033] mb-2">📜 BACKGROUND (ประวัติย่อ)</h4>
              <p className="text-sm leading-relaxed indent-8 text-justify">{questData.bio}</p>
            </div>
            <div>
              <h4 className="font-pixel text-sm font-bold text-[#5c4033] mb-2">🎯 INTERESTS & SKILLS (ทักษะและความสนใจ)</h4>
              <ul className="list-disc list-inside text-sm space-y-2 pl-2 font-semibold">
                {questData.interests.map((interest, index) => (
                  <li key={index}>{interest}</li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* ก้านไม้ม้วนกระดาษด้านล่าง */}
        <div className="h-6 w-[105%] -ml-[2.5%] bg-gradient-to-t from-[#5c4033] to-[#3e2723] rounded-full shadow-lg border-y border-[#2a1711] relative z-20">
          <div className="absolute top-0 bottom-0 left-0 w-3 bg-[#8d6e63] rounded-full border border-[#3e2723]"></div>
          <div className="absolute top-0 bottom-0 right-0 w-3 bg-[#8d6e63] rounded-full border border-[#3e2723]"></div>
        </div>

      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Prompt:wght@300;400;600;700&display=swap');
        .font-pixel { font-family: 'Press Start 2P', monospace; }
        .font-rpg { font-family: 'Prompt', sans-serif; }
        
        /* เอฟเฟกต์ม้วนกระดาษเปิดลงมาอย่างสมูท */
        @keyframes smoothUnroll {
          0% { 
            transform: scaleY(0) translateY(-100px); 
            opacity: 0; 
            max-height: 0px;
          }
          50% { 
            opacity: 0.8; 
          }
          100% { 
            transform: scaleY(1) translateY(0); 
            opacity: 1; 
            max-height: 1200px;
          }
        }
        .animate-smoothUnroll {
          animation: smoothUnroll 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          transform-origin: top center;
          overflow: hidden;
        }

        /* เอฟเฟกต์คลื่นเปลวไฟตอนกดออก */
        @keyframes fireWave {
          0% { transform: translateY(50%); opacity: 0.5; }
          20% { opacity: 1; }
          100% { transform: translateY(-60%); opacity: 1; }
        }
        .animate-fireWave {
          animation: fireWave 1.5s ease-in forwards;
        }

        /* เอฟเฟกต์ทำให้กระดาษสลายเป็นเถ้าถ่านตอนท้ายสุด */
        @keyframes paperAsh {
          0% { opacity: 1; transform: scale(1); }
          70% { opacity: 1; transform: scale(0.98); }
          100% { opacity: 0; transform: scale(0.9); }
        }
        .animate-paperAsh {
          animation: paperAsh 1.5s ease-in forwards;
        }

        .quest-paper {
          box-shadow: inset 0 0 40px rgba(92, 64, 51, 0.2), 0 20px 40px rgba(0,0,0,0.6);
        }
      `}</style>
    </main>
  );
}