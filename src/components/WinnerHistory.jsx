import React from 'react';
import { Award, Download, Trash2, Trophy, Clock, FileSpreadsheet, RefreshCw } from 'lucide-react';
import { exportWinnersToCSV } from '../utils/csvExporter';

export default function WinnerHistory({ winners, onRemoveWinner, onClearAllWinners }) {
  const handleExport = () => {
    exportWinnersToCSV(winners);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-400" />
            รายชื่อผู้ได้รับรางวัลทั้งหมด ({winners.length} คน)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            บันทึกประวัติการสุ่มรางวัลแบบเรียลไทม์ พร้อมระบบส่งออกไฟล์ CSV
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <button
            onClick={handleExport}
            disabled={winners.length === 0}
            className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <Download className="w-4 h-4 mr-1.5" />
            ส่งออก CSV (Excel)
          </button>

          <button
            onClick={onClearAllWinners}
            disabled={winners.length === 0}
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            title="ล้างประวัติการสุ่มทั้งหมด"
          >
            <Trash2 className="w-4 h-4 mr-1.5" />
            ล้างผลรางวัล
          </button>
        </div>
      </div>

      {/* Winner List Table */}
      <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/90 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-4 px-6">ลำดับ</th>
                <th className="py-4 px-6">ชื่อรางวัล</th>
                <th className="py-4 px-6">เลข BIB</th>
                <th className="py-4 px-6">ชื่อ-นามสกุล ผู้โชคดี</th>
                <th className="py-4 px-6">ระยะทาง</th>
                <th className="py-4 px-6">เวลาที่สุ่มได้</th>
                <th className="py-4 px-6 text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {winners.length > 0 ? (
                winners.map((winner, index) => (
                  <tr key={winner.id || index} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6 font-mono text-xs text-slate-400">
                      #{index + 1}
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                        <Award className="w-3.5 h-3.5 mr-1" />
                        {winner.prize || 'รางวัลสุ่ม'}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-mono text-lg font-black text-amber-400">
                      {winner.bib}
                    </td>
                    <td className="py-4 px-6 font-bold text-white">
                      {winner.name}
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-300">
                      {winner.category}
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-400 font-mono">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        {winner.drawnAt}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => onRemoveWinner(index)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                        title="ลบรายชื่อนี้"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-16 text-center text-slate-500 space-y-2">
                    <Trophy className="w-12 h-12 text-slate-700 mx-auto" />
                    <div className="font-semibold text-base">ยังไม่มีประวัติการได้รับรางวัล</div>
                    <div className="text-xs text-slate-600">กดที่แท็บ "🎰 สุ่มรางวัล" เพื่อเริ่มทำการสุ่มผู้โชคดีคนแรก</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
