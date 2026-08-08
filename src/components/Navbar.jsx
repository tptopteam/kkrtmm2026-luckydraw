import React from 'react';
import { Sparkles, Search, Award, ShieldCheck, Volume2, VolumeX, ExternalLink, FileSpreadsheet, RefreshCw } from 'lucide-react';
import { sound } from '../utils/audio';

export default function Navbar({ activeTab, setActiveTab, totalRunners, winnerCount, isMuted, setIsMuted, onOpenSyncModal }) {
  const toggleAudio = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Event Title */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-400/30">
              <Sparkles className="w-6 h-6 text-slate-950 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  เขาค้อวิ่งทะลุหมอก มาราธอน 2026
                </h1>
                <span className="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-ping"></span>
                  ระบบโปร่งใส
                </span>
              </div>
              <p className="text-xs text-slate-400 font-light flex items-center gap-2 mt-0.5">
                <span>สุ่มผู้โชคดี & ตรวจสอบรายชื่อนักวิ่ง</span>
                <span className="text-slate-600">•</span>
                <span className="text-emerald-400 font-medium">รวมนักวิ่ง {totalRunners.toLocaleString()} คน</span>
              </p>
            </div>
          </div>

          {/* Quick Action Links & Audio */}
          <div className="hidden lg:flex items-center space-x-3">
            <a
              href="https://docs.google.com/spreadsheets/d/1158tCaUavnogPla9ZrmzDtIkt3K3nZqwAw0NeRKIql0/edit?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all hover:border-slate-500"
              title="เปิด Google Sheet สรุปรายชื่อ"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400 mr-1.5" />
              Google Sheet
              <ExternalLink className="w-3 h-3 ml-1 text-slate-500" />
            </a>

            <a
              href="https://www.runlah.com/th/kkrtmm2026/participants"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all hover:border-slate-500"
              title="เปิด Runlah Official Participant List"
            >
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400 mr-1.5" />
              Runlah Official
            </a>

            <button
              onClick={onOpenSyncModal}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all"
              title="อัปเดตข้อมูล / เพิ่ม CSV"
            >
              <RefreshCw className="w-4 h-4 text-amber-400" />
            </button>

            <button
              onClick={toggleAudio}
              className={`p-2 rounded-lg border transition-all ${
                isMuted
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              }`}
              title={isMuted ? 'เปิดเสียงเอฟเฟกต์' : 'ปิดเสียงเอฟเฟกต์'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-1 sm:space-x-2 border-t border-slate-800/60 pt-2 pb-3 overflow-x-auto no-scrollbar">
          <button
            onClick={() => { sound.playClick(); setActiveTab('draw'); }}
            className={`flex items-center px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'draw'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 ring-1 ring-emerald-400/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            🎰 สุ่มรางวัล (Lucky Draw)
          </button>

          <button
            onClick={() => { sound.playClick(); setActiveTab('directory'); }}
            className={`flex items-center px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'directory'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 ring-1 ring-emerald-400/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Search className="w-4 h-4 mr-2" />
            🔍 ตรวจสอบรายชื่อนักวิ่ง ({totalRunners})
          </button>

          <button
            onClick={() => { sound.playClick(); setActiveTab('winners'); }}
            className={`flex items-center px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap relative ${
              activeTab === 'winners'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 ring-1 ring-emerald-400/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Award className="w-4 h-4 mr-2 text-amber-300" />
            🏆 ผู้โชคดี
            {winnerCount > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs font-bold bg-amber-500 text-slate-950 rounded-full">
                {winnerCount}
              </span>
            )}
          </button>

          <button
            onClick={() => { sound.playClick(); setActiveTab('transparency'); }}
            className={`flex items-center px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'transparency'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 ring-1 ring-emerald-400/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4 mr-2 text-cyan-400" />
            🛡️ ตรวจสอบความโปร่งใส
          </button>
        </div>

      </div>
    </header>
  );
}
