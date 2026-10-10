"use client";
import { useState, useEffect, useRef, Fragment } from "react";
import Link from "next/link";
import { playMinecraftClick } from "../../utils/sound";

export default function JavaProjectsPage() {
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [blockDelays, setBlockDelays] = useState<number[]>([]);
  
  const [activeTerminal, setActiveTerminal] = useState<{
    title: string;
    code: string;
  } | null>(null);
  
  const [editableCode, setEditableCode] = useState("");
  const [executionOutput, setExecutionOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [loadingProjectId, setLoadingProjectId] = useState<number | null>(null);

  const [isWaitingInput, setIsWaitingInput] = useState(false);
  const [terminalInput, setTerminalInput] = useState("");
  const resolveInputRef = useRef<((value: string) => void) | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  const javaProjects = [
    {
      id: 1,
      title: "Student Grade & OOP System",
      level: "Lv.85",
      type: "Console Application & OOP",
      desc: "ระบบจัดการเกรดและข้อมูลนักเรียน ใช้หลักการ Object-Oriented Programming (OOP) ผ่านคลาส Person, Student และ Calculator",
      tech: ["Java", "OOP", "Scanner"],
      github: "https://github.com/gulentogg/all-java",
      githubRawUrl: "", 
      fallbackCode: `import java.util.Scanner;

public class AppStudentGrade {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.println("=== STUDENT GRADE SYSTEM ===");
        System.out.print("Enter Student Name: ");
        String name = scanner.nextLine();
        
        System.out.print("Enter Score (0-100): ");
        double score = scanner.nextDouble();
        
        char grade = calculateGrade(score);
        System.out.println("Student: " + name + " | Final Grade: " + grade);
    }
    
    public static char calculateGrade(double score) {
        if (score >= 80) return 'A';
        else if (score >= 70) return 'B';
        else if (score >= 60) return 'C';
        else if (score >= 50) return 'D';
        else return 'F';
    }
}`
    },
    {
      id: 2,
      title: "Score Calculator & File Manager",
      level: "Lv.90",
      type: "Console & File I/O",
      desc: "ระบบคำนวณคะแนนเฉลี่ย ตัดเกรด และจัดการบันทึกข้อมูลลงไฟล์ Text/Database ภายนอกอัตโนมัติ",
      tech: ["Java", "File I/O", "Algorithm"],
      github: "https://github.com/gulentogg/all-java",
      githubRawUrl: "",
      fallbackCode: `import java.util.Scanner;

public class Gradecal {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println("=== SCORE CALCULATOR ===");
        System.out.print("Enter Subject Name: ");
        String subject = sc.nextLine();
        
        System.out.print("Enter Midterm Score: ");
        double mid = sc.nextDouble();
        System.out.print("Enter Final Score: ");
        double fin = sc.nextDouble();
        
        double total = mid + fin;
        System.out.println("Subject: " + subject + " | Total Score: " + total);
        System.out.println("Status: " + (total >= 50 ? "PASSED ✅" : "FAILED ❌"));
    }
}`
    }
  ];

  useEffect(() => {
    const delays = Array.from({ length: 120 }).map(() => Math.random() * 0.5);
    setBlockDelays(delays);
    setIsFirstLoad(true);
    const timer = setTimeout(() => setIsFirstLoad(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isWaitingInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isWaitingInput]);

  const handleOpenTerminal = async (project: typeof javaProjects[0]) => {
    playMinecraftClick();
    setIsRunning(false);
    setIsWaitingInput(false);
    setTerminalInput("");
    if (resolveInputRef.current) {
      resolveInputRef.current("");
      resolveInputRef.current = null;
    }

    setLoadingProjectId(project.id);
    let fetchedCode = project.fallbackCode;

    if (project.githubRawUrl) {
      try {
        const res = await fetch(project.githubRawUrl);
        if (res.ok) {
          fetchedCode = await res.text();
        }
      } catch (err) {
        console.warn("Network error fetching from GitHub, using fallback code.");
      }
    }

    setLoadingProjectId(null);
    setActiveTerminal({ title: project.title, code: fetchedCode });
    setEditableCode(fetchedCode);
    setExecutionOutput(">>> Initialized Java Virtual Machine (JVM)...\n>>> Click 'RUN SCRIPT LIVE' to compile & execute...");
  };

  const handleCloseTerminal = () => {
    playMinecraftClick();
    setActiveTerminal(null);
    setIsRunning(false);
    setIsWaitingInput(false);
    setTerminalInput("");
    if (resolveInputRef.current) {
      resolveInputRef.current("");
      resolveInputRef.current = null;
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!activeTerminal) return;
    const newCode = e.target.value;

    const getLockedContent = (codeStr: string) => {
      return codeStr
        .split("\n")
        .filter((line) => {
          const t = line.trim();
          return !t.includes("System.out.print") && !t.includes("scanner.next") && !t.includes("sc.next");
        })
        .join("\n");
    };

    if (getLockedContent(activeTerminal.code) === getLockedContent(newCode)) {
      setEditableCode(newCode);
      if (executionOutput.includes("[SECURITY WARNING]")) {
        setExecutionOutput(">>> Ready to execute...");
      }
    } else {
      setExecutionOutput(">>> [SECURITY WARNING]: ⚠️ ACCESS DENIED!\n>>> You can ONLY edit contents inside 'System.out.print()' or Scanner inputs.");
    }
  };

  const askInput = (promptText: string) => {
    return new Promise<string>((resolve) => {
      setExecutionOutput((prev) => prev + promptText);
      setIsWaitingInput(true);
      resolveInputRef.current = resolve;
    });
  };

  const handleTerminalKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && isWaitingInput) {
      const val = terminalInput;
      setExecutionOutput((prev) => prev + val + "\n");
      setTerminalInput("");
      setIsWaitingInput(false);
      if (resolveInputRef.current) {
        resolveInputRef.current(val);
        resolveInputRef.current = null;
      }
    }
  };

  const handleRunRealtimeCode = async () => {
    if (isRunning) return;
    playMinecraftClick();
    setIsRunning(true);
    setExecutionOutput(">>> Compiling Java source code (.java -> .class)...\n>>> Running JVM bytecode...\n\n");
    await new Promise(r => setTimeout(r, 500));

    try {
      const lines = editableCode.split("\n");
      let executedMain = false;

      for (let line of lines) {
        if (!activeTerminal) break;
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("//") || trimmed.startsWith("import ") || trimmed.startsWith("public class") || trimmed.startsWith("}") || trimmed.startsWith("{")) continue;

        const printMatch = trimmed.match(/System\.out\.print(?:ln)?\((["'])(.*?)\1\)/);
        if (printMatch) {
          const textToPrint = printMatch[2];
          setExecutionOutput((prev) => prev + textToPrint + "\n");
          continue;
        }

        if (trimmed.includes("scanner.next") || trimmed.includes("sc.next")) {
          const userValue = await askInput("");
          setExecutionOutput((prev) => prev + `[Input Recorded]: ${userValue}\n`);
          
          if (editableCode.includes("calculateGrade")) {
            setExecutionOutput((prev) => prev + "Student: Somchai | Final Grade: A (Score: 85.5)\n\n");
          } else {
            setExecutionOutput((prev) => prev + "Subject: Java Programming | Total Score: 88.0 | Status: PASSED ✅\n\n");
          }
          executedMain = true;
          break;
        }
      }

      if (activeTerminal && !executedMain) {
        setExecutionOutput((prev) => prev + "\n>>> Program executed successfully with exit code 0.");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsRunning(false);
      setIsWaitingInput(false);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (preRef.current) {
      preRef.current.scrollTop = e.currentTarget.scrollTop;
      preRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-[#030712] font-rpg">
      
      {isFirstLoad && blockDelays.length > 0 && (
        <div className="fixed inset-0 z-50 flex flex-wrap pointer-events-none overflow-hidden">
          {blockDelays.map((delay, i) => (
            <div
              key={i}
              className="w-[10vw] h-[10vh] bg-[#9a3412] border-4 border-[#7c2d12] flex items-center justify-center relative shadow-md"
              style={{ animation: `blockBreak 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards`, animationDelay: `${delay}s` }}
            >
              <div className="absolute top-1 left-1 w-2 h-2 bg-[#7c2d12] opacity-60"></div>
              <div className="absolute bottom-2 right-2 w-3 h-2 bg-[#7c2d12] opacity-50"></div>
            </div>
          ))}
        </div>
      )}

      <Link 
        href="/projects"
        onClick={playMinecraftClick}
        className="absolute top-6 left-6 z-30 px-4 py-2 bg-[#181820] border-2 border-orange-500 text-orange-400 rounded font-pixel text-xs flex items-center gap-2 hover:bg-[#1e293b] shadow-[0_0_10px_rgba(249,115,22,0.3)] transition-all active:scale-95"
      >
        <span>◀ BACK TO TECH STACK</span>
      </Link>

      <div className="max-w-4xl w-full bg-[#111827]/95 backdrop-blur border-4 border-orange-600/60 p-8 rounded relative z-20 shadow-[0_0_30px_rgba(234,88,12,0.2)]">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-orange-400 mb-2 font-pixel drop-shadow-[2px_2px_0px_#000]">
            ☕ JAVA VAULT
          </h1>
          <p className="text-xs text-yellow-400 font-pixel tracking-widest">[ OBJECT-ORIENTED & CONSOLE APPS ]</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {javaProjects.map((project) => (
            <div key={project.id} className="bg-[#1f2937] border-2 border-orange-500/40 p-5 rounded-lg flex flex-col justify-between hover:border-orange-400 transition-all group">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="px-2 py-0.5 bg-orange-950 border border-orange-600 text-orange-300 font-pixel text-[10px] rounded">{project.level}</span>
                  <span className="text-[10px] text-slate-400 font-pixel">{project.type}</span>
                </div>
                <h3 className="font-pixel text-sm font-bold text-white mb-2 group-hover:text-orange-300 transition-colors">{project.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4 font-light">{project.desc}</p>
              </div>

              <div>
                <div className="flex gap-1 flex-wrap mb-4">
                  {project.tech.map((t) => <span key={t} className="px-2 py-0.5 bg-[#111827] border border-slate-700 text-[10px] text-slate-300 rounded">{t}</span>)}
                </div>
                <div className="flex gap-2">
                  <a href={project.github} target="_blank" rel="noopener noreferrer" onClick={playMinecraftClick} className="flex-1 text-center py-2 bg-slate-800 border border-slate-600 text-slate-200 font-pixel text-[10px] rounded hover:bg-slate-700 transition-all active:scale-95">GITHUB</a>
                  <button onClick={() => handleOpenTerminal(project)} disabled={loadingProjectId === project.id} className="flex-1 text-center py-2 bg-orange-600 border border-orange-500 text-white font-pixel text-[10px] rounded hover:bg-orange-500 transition-all active:scale-95 disabled:opacity-50">
                    {loadingProjectId === project.id ? "SUMMONING..." : "PREVIEW"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {activeTerminal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="max-w-3xl w-full bg-[#0d1117] border-4 border-orange-500 rounded-lg shadow-[0_0_30px_rgba(249,115,22,0.6)] overflow-hidden font-mono">
            
            <div className="bg-[#161b22] px-4 py-3 border-b border-orange-500/40 flex justify-between items-center">
              <span className="text-xs text-orange-400 font-pixel">☕ JVM SIMULATOR: {activeTerminal.title}</span>
              <button onClick={handleCloseTerminal} className="text-slate-400 hover:text-white font-pixel text-xs px-2 py-1 bg-red-600/30 border border-red-500 rounded cursor-pointer">[X] CLOSE</button>
            </div>

            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-400 font-pixel text-[10px]">// SECURE JAVA EDITOR</span>
                  <span className="text-[10px] text-yellow-400">Locked / Blur Active</span>
                </div>
                
                <div className="relative w-full h-52 bg-[#161b22] rounded border border-slate-700 overflow-hidden shadow-inner group">
                  {/* 🧠 บังคับ lineHeight ให้เป็น 28px เท่ากัน และแยก \n ออกจาก <span> เพื่อแก้บั๊กภาษาไทยดันบรรทัดแตก */}
                  <pre 
                    ref={preRef} 
                    className="absolute inset-0 p-4 m-0 font-mono text-xs whitespace-pre-wrap break-words overflow-hidden box-border pointer-events-none z-0"
                    style={{ lineHeight: "28px" }}
                  >
                    {editableCode.split("\n").map((line, idx, arr) => {
                      const isEditable = line.includes("System.out.print") || line.includes("scanner") || line.includes("sc.");
                      return (
                        <Fragment key={idx}>
                          <span className={`transition-all duration-300 ${isEditable ? "text-orange-300 font-bold" : "text-slate-500 blur-[3px] group-hover:blur-[1px]"}`}>
                            {line}
                          </span>
                          {idx < arr.length - 1 ? "\n" : ""}
                        </Fragment>
                      );
                    })}
                    {/* จัดการบั๊กเวลาผู้ใช้กด Enter ที่บรรทัดสุดท้าย */}
                    {editableCode.endsWith('\n') ? "\n " : ""}
                  </pre>

                  <textarea
                    value={editableCode}
                    onChange={handleCodeChange}
                    onScroll={handleScroll}
                    className="absolute inset-0 w-full h-full p-4 m-0 font-mono text-xs resize-none outline-none border-none focus:outline-none z-10 bg-transparent selection:bg-orange-500/30 whitespace-pre-wrap break-words box-border overflow-auto"
                    spellCheck={false}
                    style={{ color: "transparent", caretColor: "#fb923c", lineHeight: "28px" }}
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-400 font-pixel text-[10px]">// JVM CONSOLE OUTPUT</span>
                  {isRunning && <span className="text-yellow-400 animate-pulse font-pixel text-[10px]">RUNNING...</span>}
                </div>
                
                <div className={`w-full h-52 bg-[#010409] p-3 rounded border overflow-y-auto shadow-inner font-mono text-xs transition-colors ${executionOutput.includes("ACCESS DENIED") ? "border-red-500/50 text-red-400" : "border-orange-500/30 text-green-400"}`}>
                  <span className="whitespace-pre-wrap">{executionOutput}</span>
                  
                  {isWaitingInput && (
                    <input
                      ref={inputRef}
                      type="text"
                      value={terminalInput}
                      onChange={(e) => setTerminalInput(e.target.value)}
                      onKeyDown={handleTerminalKeyDown}
                      className="bg-transparent text-yellow-300 outline-none border-none w-1/2 ml-1"
                      spellCheck={false}
                      autoComplete="off"
                    />
                  )}
                </div>
              </div>

            </div>

            <div className="bg-[#161b22] px-4 py-3 border-t border-orange-500/40 flex justify-between items-center">
              <span className="text-[10px] text-slate-400 font-rpg">
                * ล็อก Line-height ภาษาไทยตายตัว หมดปัญหาเคอร์เซอร์ร่วง
              </span>
              <button
                onClick={handleRunRealtimeCode}
                disabled={isRunning && !isWaitingInput}
                className="px-6 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-pixel text-xs rounded border border-orange-400 cursor-pointer disabled:opacity-50 shadow-[0_3px_0_#9a3412]"
              >
                {isRunning ? (isWaitingInput ? "WAITING INPUT..." : "COMPILING...") : "▶ RUN SCRIPT LIVE"}
              </button>
            </div>

          </div>
        </div>
      )}

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