import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Trophy, Shuffle, CheckCircle, Flame, Filter, ShieldCheck, UserCheck, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';

export default function LuckyDraw({ participants, winners, onAddWinner }) {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [prizeName, setPrizeName] = useState('รางวัลพิเศษสำหรับนักวิ่ง');
  const [preventDuplicates, setPreventDuplicates] = useState(true);
  const [spinDuration, setSpinDuration] = useState(4);
  
  const [isSpinning, setIsSpinning] = useState(false);
  const [displayBib, setDisplayBib] = useState('0000');
  const [displayRunner, setDisplayRunner] = useState(null);
  const [currentWinner, setCurrentWinner] = useState(null);
  const [showWinnerModal, setShowWinnerModal] = useState(false);

  // Compute eligible pool of participants
  const eligiblePool = participants.filter(p => {
    // Filter category
    if (selectedCategory !== 'ALL') {
      if (selectedCategory === 'CHARITY') {
        if (!p.category.includes('CHARITY')) return false;
      } else {
        if (!p.category.includes(selectedCategory)) return false;
      }
    }
    // Exclude existing winners if preventDuplicates is true
    if (preventDuplicates && winners.some(w => w.bib === p.bib)) {
      return false;
    }
    return true;
  });

  // Extract categories with live counts for dropdown
  const categories = [
    { id: 'ALL', label: `ทุกระยะทาง (รวมทั้งหมด ${participants.length.toLocaleString()} คน)` },
    { id: '42.195', label: `มาราธอน 42.195 กม. (รวม Charity - ${participants.filter(p => p.category.includes('42.195')).length} คน)` },
    { id: '21', label: `ฮาล์ฟมาราธอน 21 กม. (${participants.filter(p => p.category.includes('21')).length} คน)` },
    { id: '10', label: `มินิมาราธอน 10 กม. (${participants.filter(p => p.category.includes('10')).length} คน)` },
    { id: '5', label: `ฟันรัน 5 กม. (${participants.filter(p => p.category.includes('5')).length} คน)` },
    { id: 'CHARITY', label: `เฉพาะประเภท CHARITY ⭐ (${participants.filter(p => p.category.includes('CHARITY')).length} คน)` }
  ];

  // Start spinning lucky draw engine
  const handleStartDraw = () => {
    if (eligiblePool.length === 0) {
      alert('ไม่มีรายชื่อ BIB คงเหลือในกลุ่มที่เลือก');
      return;
    }

    sound.playClick();
    setIsSpinning(true);
    setCurrentWinner(null);
    setShowWinnerModal(false);

    // Pick final random winner from pool
    const winnerIndex = Math.floor(Math.random() * eligiblePool.length);
    const selectedWinner = eligiblePool[winnerIndex];

    const startTime = Date.now();
    const durationMs = spinDuration * 1000;

    const spinInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      
      const randomIdx = Math.floor(Math.random() * eligiblePool.length);
      const tempRunner = eligiblePool[randomIdx];
      
      setDisplayBib(tempRunner.bib.padStart(4, '0'));
      setDisplayRunner(tempRunner);
      sound.playTick();

      if (elapsed >= durationMs) {
        clearInterval(spinInterval);
        setIsSpinning(false);
        setDisplayBib(selectedWinner.bib.padStart(4, '0'));
        setDisplayRunner(selectedWinner);
        setCurrentWinner(selectedWinner);

        sound.playFanfare();
        triggerConfetti();
        setShowWinnerModal(true);
      }
    }, 80);
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });

      setTimeout(() => {
        confetti({
          particleCount: 80,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 80,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
      }, 250);
    } catch (e) {}
  };

  const handleConfirmWinner = () => {
    if (!currentWinner) return;
    onAddWinner({
      ...currentWinner,
      prize: prizeName,
      drawnAt: new Date().toLocaleTimeString('th-TH')
    });
    setShowWinnerModal(false);
  };

  const bibDigits = (displayBib || '0000').padStart(4, '0').split('');

  return (
    <div className="space-y-8 max-w-6xl mx-auto">

      {/* Main Controls Card */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl shadow-2xl border border-slate-800 relative overflow-hidden">
        
        {/* Decorative background glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Prize Name Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-400" />
              ชื่อรางวัลที่ต้องการสุ่ม
            </label>
            <input
              type="text"
              value={prizeName}
              onChange={(e) => setPrizeName(e.target.value)}
              placeholder="ระบุชื่อรางวัล..."
              className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm font-medium transition-all"
            />
          </div>

          {/* Category Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-emerald-400" />
              กลุ่มระยะทางที่ต้องการสุ่ม
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm font-medium transition-all"
            >
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Settings / Options */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              เงื่อนไขความโปร่งใส
            </label>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-xs">
              <span className="text-slate-300 font-medium flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                ตัด BIB ที่ได้รางวัลแล้ว
              </span>
              <input
                type="checkbox"
                checked={preventDuplicates}
                onChange={(e) => setPreventDuplicates(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 bg-slate-800 border-slate-600 cursor-pointer"
              />
            </div>
          </div>

        </div>

        {/* Dynamic BIB Slot Display Stage */}
        <div className="text-center py-6 sm:py-10 space-y-6">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 text-xs font-semibold">
            <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
            <span>จำนวน BIB ที่มีสิทธิ์สุ่มในขณะนี้:</span>
            <span className="text-emerald-400 text-sm font-extrabold">{eligiblePool.length.toLocaleString()}</span>
            <span>คน</span>
          </div>

          {/* Slot Machine Digital Reel */}
          <div className="flex justify-center items-center gap-3 sm:gap-5 my-4">
            {bibDigits.map((digit, idx) => (
              <div
                key={idx}
                className={`w-16 h-24 sm:w-28 sm:h-40 bib-digit-box flex items-center justify-center rounded-2xl border-2 transition-all ${
                  isSpinning ? 'border-emerald-400/80 scale-105 shadow-emerald-500/30' : 'border-slate-700'
                }`}
              >
                <span className="font-mono text-4xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400 tracking-tighter">
                  {digit}
                </span>
              </div>
            ))}
          </div>

          {/* Live Preview of runner name during spin */}
          <div className="h-12 flex items-center justify-center">
            {displayRunner ? (
              <div className="animate-fade-in text-slate-300 text-sm sm:text-base font-medium flex items-center gap-2 bg-slate-900/60 px-4 py-1.5 rounded-full border border-slate-800">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span>{displayRunner.name}</span>
                <span className="text-slate-500">|</span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400">{displayRunner.category}</span>
              </div>
            ) : (
              <span className="text-slate-500 text-sm">พร้อมสุ่มรางวัล BIB...</span>
            )}
          </div>

          {/* BIG SPIN BUTTON */}
          <div className="pt-2">
            <button
              onClick={handleStartDraw}
              disabled={isSpinning || eligiblePool.length === 0}
              className={`w-full sm:w-80 py-4 sm:py-5 px-8 rounded-2xl font-extrabold text-lg sm:text-xl shadow-2xl transition-all flex items-center justify-center gap-3 mx-auto ${
                isSpinning
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : eligiblePool.length === 0
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 shadow-emerald-500/30 hover:scale-105 active:scale-95 ring-2 ring-emerald-400/50'
              }`}
            >
              {isSpinning ? (
                <>
                  <RefreshCw className="w-6 h-6 animate-spin text-slate-400" />
                  <span>กำลังสุ่ม BIB...</span>
                </>
              ) : (
                <>
                  <Shuffle className="w-6 h-6 text-slate-950" />
                  <span>กดเพื่อสุ่มรางวัล BIB!</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>

      {/* Winner Celebration Modal */}
      {showWinnerModal && currentWinner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="glass-card max-w-lg w-full p-6 sm:p-8 rounded-3xl border-2 border-amber-400/50 shadow-2xl glow-gold text-center relative overflow-hidden space-y-6">
            
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/40">
              <Trophy className="w-8 h-8 text-slate-950 animate-bounce" />
            </div>

            <div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 mb-2">
                🎉 ยินดีด้วยกับผู้โชคดี!
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {prizeName}
              </h2>
            </div>

            {/* Winner Details Card */}
            <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 space-y-3">
              <div className="text-slate-400 text-xs uppercase font-semibold">หมายเลข BIB ผู้โชคดี</div>
              <div className="font-mono text-5xl sm:text-6xl font-black text-amber-400 tracking-wider">
                {currentWinner.bib}
              </div>
              <div className="text-xl font-bold text-white pt-2">
                {currentWinner.name}
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-slate-300">
                <span className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-emerald-400 font-semibold">
                  {currentWinner.category}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-slate-300">
                  เพศ: {currentWinner.gender}
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowWinnerModal(false)}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-all"
              >
                ยกเลิก / ไม่บันทึก
              </button>
              <button
                onClick={handleConfirmWinner}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-sm font-bold shadow-lg shadow-amber-500/25 transition-all"
              >
                บันทึกรายชื่อผู้โชคดี
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
