"use client";
import { useState, useEffect, useRef } from "react";
import { playMinecraftClick } from "../utils/sound";

export default function BGMPlayer() {
  const [isPlayingBGM, setIsPlayingBGM] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio("/adventure-bgm.mp3");
    audio.loop = true;
    audio.volume = 0.4;
    audioRef.current = audio;

    const savedBGM = localStorage.getItem("bgm_playing");
    if (savedBGM === "true") {
      audio.play().then(() => {
        setIsPlayingBGM(true);
      }).catch(() => {});
    }

    return () => {
      audio.pause();
    };
  }, []);

  const toggleBGM = () => {
    playMinecraftClick();
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlayingBGM) {
      audio.pause();
      setIsPlayingBGM(false);
      localStorage.setItem("bgm_playing", "false");
    } else {
      audio.play().then(() => {
        setIsPlayingBGM(true);
        localStorage.setItem("bgm_playing", "true");
      }).catch((err) => {
        console.warn("Audio playback prevented:", err);
      });
    }
  };

  return (
    <button
      onClick={toggleBGM}
      className="absolute top-6 right-6 z-50 px-4 py-2 bg-[#181820] border-2 border-[#44445c] text-slate-200 rounded font-pixel text-xs flex items-center gap-2 hover:bg-[#282838] hover:border-green-500 shadow-lg transition-all cursor-pointer active:scale-95"
    >
      <span>{isPlayingBGM ? "🔊 BGM: ON" : "🔇 BGM: OFF"}</span>
    </button>
  );
}