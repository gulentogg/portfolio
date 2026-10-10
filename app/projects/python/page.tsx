"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { playMinecraftClick } from "../../utils/sound";

export default function PythonProjectsPage() {
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

  const pythonProjects = [
    {
      id: 1,
      title: "Python POS & Admin Management",
      level: "Lv.90",
      type: "Console Application & JSON DB",
      desc: "ระบบบริหารจัดการร้านอาหารและคิดเงิน (POS) พร้อมระบบจัดการโต๊ะ สมาชิก และคำนวณส่วนลดอัตโนมัติ",
      tech: ["Python", "JSON", "CLI"],
      github: "https://github.com/gulentogg/pos_only_py",
      githubRawUrl: "https://raw.githubusercontent.com/gulentogg/pos_only_py/refs/heads/main/admin/mainprogram.py",
      fallbackCode: `import module

def main():
    message = 'admin management menu.\\n1. check bill\\n2. manage Overview\\n3. report\\n\\nEnter choice...'
    try:
        while True:
            choice = input(message)
            if choice == '1' : module.bill()
            elif choice == '2' : module.admin_menu()
            elif choice == '3' : module.report()
    except KeyboardInterrupt : print('End program...') 

if __name__ == '__main__' :
    main()`
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

  // ฟังก์ชันเปิด Terminal พร้อมรีเซ็ตสถานะเก่าให้เกลี้ยง
  const handleOpenTerminal = async (project: typeof pythonProjects[0]) => {
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

    try {
      const res = await fetch(project.githubRawUrl);
      if (res.ok) {
        fetchedCode = await res.text();
      }
    } catch (err) {
      console.warn("Network error fetching from GitHub, using fallback code.");
    }

    setLoadingProjectId(null);
    setActiveTerminal({ title: project.title, code: fetchedCode });
    setEditableCode(fetchedCode);
    setExecutionOutput(">>> Summoned mainprogram.py from GitHub successfully.\n>>> Click 'RUN SCRIPT LIVE' to start POS System...");
  };

  // ฟังก์ชันปิด Terminal และล้างค่าสถานะการรอรับ input ค้างไว้ทั้งหมด
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
          return !t.startsWith("print(") && !t.includes("input(");
        })
        .join("\n");
    };

    if (getLockedContent(activeTerminal.code) === getLockedContent(newCode)) {
      setEditableCode(newCode);
      if (executionOutput.includes("[SECURITY WARNING]")) setExecutionOutput(">>> Ready to execute...");
    } else {
      setExecutionOutput(">>> [SECURITY WARNING]: ⚠️ ACCESS DENIED!\n>>> You can ONLY edit contents inside 'print()' or 'input()'.");
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
    setExecutionOutput(">>> Initializing Python 3.10 Runtime Environment...\n\n");
    await new Promise(r => setTimeout(r, 400));

    try {
      const lines = editableCode.split("\n");
      let executedMain = false;

      for (let line of lines) {
        if (!activeTerminal) break; // ถ้ากดปิดไประหว่างรัน ให้หยุดทันที
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("import ")) continue;

        const printMatch = trimmed.match(/print\((["'])(.*?)\1\)/);
        if (printMatch) {
          const textToPrint = printMatch[2];
          setExecutionOutput((prev) => prev + textToPrint + "\n");
          continue;
        }

        const inputMatch = trimmed.match(/input\((["'])(.*?)\1\)/);
        if (inputMatch) {
          const promptText = inputMatch[2];
          const userValue = await askInput(promptText);
          setExecutionOutput((prev) => prev + `[Received]: ${userValue}\n`);
          continue;
        }

        if (trimmed === "main()") {
          executedMain = true;
          const choice = await askInput("admin management menu.\n1. check bill\n2. manage Overview\n3. report\n\nEnter choice...");
          if (choice === '1') {
            const table = await askInput("Enter table number to print bill (ctrl + C to go back): ");
            setExecutionOutput((prev) => prev + `\n--- BILL OF TABLE ${table} ---\nCustomer name.. : Somchai\n>> TOTAL << 427.50\n\n`);
          } else if (choice === '2') {
            setExecutionOutput((prev) => prev + "\n\\ ADMIN _ MENU //\n1. set tables\n2. change menu\n3. add member\n\n");
          } else if (choice === '3') {
            setExecutionOutput((prev) => prev + "\n-- Daily & Member Reports Loaded --\n\n");
          }
        }
      }

      if (activeTerminal && !executedMain && !executionOutput.includes("--- BILL")) {
        setExecutionOutput((prev) => prev + "\n>>> Script executed successfully.");
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
              className="w-[10vw] h-[10vh] bg-[#1e3a8a] border-4 border-[#172554] flex items-center justify-center relative shadow-md"
              style={{ animation: `blockBreak 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards`, animationDelay: `${delay}s` }}
            >
              <div className="absolute top-1 left-1 w-2 h-2 bg-[#172554] opacity-60"></div>
              <div className="absolute bottom-2 right-2 w-3 h-2 bg-[#172554] opacity-50"></div>
            </div>
          ))}
        </div>
      )}

      <Link 
        href="/projects"
        onClick={playMinecraftClick}
        className="absolute top-6 left-6 z-30 px-4 py-2 bg-[#181820] border-2 border-[#3b82f6] text-blue-400 rounded font-pixel text-xs flex items-center gap-2 hover:bg-[#1e293b] shadow-[0_0_10px_rgba(59,130,246,0.3)] transition-all active:scale-95"
      >
        <span>◀ BACK TO TECH STACK</span>
      </Link>

      <div className="max-w-4xl w-full bg-[#111827]/95 backdrop-blur border-4 border-blue-600/60 p-8 rounded relative z-20 shadow-[0_0_30px_rgba(37,99,235,0.2)]">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-400 mb-2 font-pixel drop-shadow-[2px_2px_0px_#000]">
            🐍 PYTHON VAULT
          </h1>
          <p className="text-xs text-yellow-400 font-pixel tracking-widest">[ EDIT & EXECUTE PYTHON SCRIPTS ]</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {pythonProjects.map((project) => (
            <div key={project.id} className="bg-[#1f2937] border-2 border-blue-500/40 p-5 rounded-lg flex flex-col justify-between hover:border-blue-400 transition-all group md:col-span-3">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="px-2 py-0.5 bg-blue-950 border border-blue-600 text-blue-300 font-pixel text-[10px] rounded">{project.level}</span>
                  <span className="text-[10px] text-slate-400 font-pixel">{project.type}</span>
                </div>
                <h3 className="font-pixel text-sm font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">{project.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4 font-light">{project.desc}</p>
              </div>

              <div>
                <div className="flex gap-1 flex-wrap mb-4">
                  {project.tech.map((t) => <span key={t} className="px-2 py-0.5 bg-[#111827] border border-slate-700 text-[10px] text-slate-300 rounded">{t}</span>)}
                </div>
                <div className="flex gap-2">
                  <a href={project.github} target="_blank" rel="noopener noreferrer" onClick={playMinecraftClick} className="flex-1 text-center py-2 bg-slate-800 border border-slate-600 text-slate-200 font-pixel text-[10px] rounded hover:bg-slate-700 transition-all active:scale-95">GITHUB</a>
                  <button onClick={() => handleOpenTerminal(project)} disabled={loadingProjectId === project.id} className="flex-1 text-center py-2 bg-blue-600 border border-blue-500 text-white font-pixel text-[10px] rounded hover:bg-blue-500 transition-all active:scale-95 disabled:opacity-50">
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
          <div className="max-w-3xl w-full bg-[#0d1117] border-4 border-blue-500 rounded-lg shadow-[0_0_30px_rgba(59,130,246,0.6)] overflow-hidden font-mono">
            
            <div className="bg-[#161b22] px-4 py-3 border-b border-blue-500/40 flex justify-between items-center">
              <span className="text-xs text-blue-400 font-pixel">⚡ PYTHON SIMULATOR: {activeTerminal.title}</span>
              <button onClick={handleCloseTerminal} className="text-slate-400 hover:text-white font-pixel text-xs px-2 py-1 bg-red-600/30 border border-red-500 rounded cursor-pointer">[X] CLOSE</button>
            </div>

            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-400 font-pixel text-[10px]">// SECURE LIVE EDITOR (GITHUB)</span>
                  <span className="text-[10px] text-yellow-400">Locked / Cursor Active</span>
                </div>
                
                <div className="relative w-full h-52 bg-[#161b22] rounded border border-slate-700 overflow-hidden shadow-inner group">
                  <pre ref={preRef} className="absolute inset-0 p-3 m-0 pointer-events-none font-mono text-xs whitespace-pre-wrap break-words overflow-hidden">
                    {editableCode.split("\n").map((line, idx, arr) => {
                      const isEditable = line.trim().startsWith("print(") || line.trim().includes("input(");
                      return (
                        <span key={idx} className={`transition-all duration-300 ${isEditable ? "text-green-300 font-bold" : "text-slate-400 blur-[4px] group-hover:blur-[1px]"}`}>
                          {line}{idx < arr.length - 1 ? "\n" : ""}
                        </span>
                      );
                    })}
                  </pre>
                  <textarea
                    value={editableCode}
                    onChange={handleCodeChange}
                    onScroll={handleScroll}
                    className="absolute inset-0 w-full h-full p-3 font-mono text-xs resize-none focus:outline-none z-10 bg-transparent selection:bg-blue-500/30"
                    spellCheck={false}
                    style={{ color: "transparent", caretColor: "#38bdf8" }}
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-400 font-pixel text-[10px]">// POS TERMINAL OUTPUT</span>
                  {isRunning && <span className="text-yellow-400 animate-pulse font-pixel text-[10px]">RUNNING...</span>}
                </div>
                
                <div className={`w-full h-52 bg-[#010409] p-3 rounded border border-blue-500/30 overflow-y-auto shadow-inner font-mono text-xs transition-colors ${executionOutput.includes("ACCESS DENIED") ? "text-red-400 border-red-500/50" : "text-green-400"}`}>
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

            <div className="bg-[#161b22] px-4 py-3 border-t border-blue-500/40 flex justify-between items-center">
              <span className="text-[10px] text-slate-400 font-rpg">
                * ปิดหน้าต่างหรือเปลี่ยนหน้า State จะถูกล้างให้อัตโนมัติไม่มีค้าง
              </span>
              <button
                onClick={handleRunRealtimeCode}
                disabled={isRunning && !isWaitingInput}
                className="px-6 py-2.5 bg-green-600 hover:bg-green-500 text-white font-pixel text-xs rounded border border-green-400 cursor-pointer disabled:opacity-50 shadow-[0_3px_0_#14532d]"
              >
                {isRunning ? (isWaitingInput ? "WAITING INPUT..." : "RUNNING...") : "▶ RUN SCRIPT LIVE"}
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