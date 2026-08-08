import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LuckyDraw from './components/LuckyDraw';
import RunnerDirectory from './components/RunnerDirectory';
import WinnerHistory from './components/WinnerHistory';
import TransparencyLog from './components/TransparencyLog';
import DataSyncModal from './components/DataSyncModal';

// Load pre-extracted participants dataset
import initialParticipants from '../data/participants.json';

export default function App() {
  const [activeTab, setActiveTab] = useState('draw');
  const [participants, setParticipants] = useState(initialParticipants || []);
  const [isMuted, setIsMuted] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);

  // Persistent Winners state in localStorage
  const [winners, setWinners] = useState(() => {
    try {
      const saved = localStorage.getItem('kkrtmm2026_winners');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('kkrtmm2026_winners', JSON.stringify(winners));
    } catch (e) {}
  }, [winners]);

  const handleAddWinner = (winner) => {
    setWinners(prev => [winner, ...prev]);
  };

  const handleRemoveWinner = (index) => {
    if (confirm('คุณต้องการลบรายชื่อผู้ได้รับรางวัลรายการนี้หรือไม่?')) {
      setWinners(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleClearAllWinners = () => {
    if (confirm('คำเตือน: คุณต้องการล้างรายชื่อผู้ได้รับรางวัลทั้งหมดหรือไม่?')) {
      setWinners([]);
    }
  };

  const handleImportCSV = (newRunners) => {
    setParticipants(prev => [...newRunners, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col font-sans">
      
      {/* Header Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalRunners={participants.length}
        winnerCount={winners.length}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        onOpenSyncModal={() => setIsSyncModalOpen(true)}
      />

      {/* Main Content Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {activeTab === 'draw' && (
          <LuckyDraw
            participants={participants}
            winners={winners}
            onAddWinner={handleAddWinner}
          />
        )}

        {activeTab === 'directory' && (
          <RunnerDirectory
            participants={participants}
          />
        )}

        {activeTab === 'winners' && (
          <WinnerHistory
            winners={winners}
            onRemoveWinner={handleRemoveWinner}
            onClearAllWinners={handleClearAllWinners}
          />
        )}

        {activeTab === 'transparency' && (
          <TransparencyLog
            totalRunners={participants.length}
            winnerCount={winners.length}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500 glass-panel">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            เขาค้อวิ่งทะลุหมอก มาราธอน 2026 • ระบบสุ่มผู้โชคดีและตรวจสอบรายชื่อเพื่อความโปร่งใส
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <a
              href="https://docs.google.com/spreadsheets/d/1158tCaUavnogPla9ZrmzDtIkt3K3nZqwAw0NeRKIql0/edit?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 transition-colors"
            >
              Google Sheet
            </a>
            <span>•</span>
            <a
              href="https://www.runlah.com/th/kkrtmm2026/participants"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400 transition-colors"
            >
              Runlah Official
            </a>
          </div>
        </div>
      </footer>

      {/* CSV Sync Modal */}
      <DataSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        onImportCSV={handleImportCSV}
        totalCount={participants.length}
      />

    </div>
  );
}
