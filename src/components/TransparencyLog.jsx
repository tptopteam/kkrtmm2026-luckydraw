import React from 'react';
import { ShieldCheck, CheckCircle2, Lock, ExternalLink, Database } from 'lucide-react';

export default function TransparencyLog({ totalRunners, winnerCount }) {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">รายงานความโปร่งใสของระบบสุ่มรางวัล</h2>
            <p className="text-xs text-slate-400">
              การันตีความถูกต้อง 100% จากฐานข้อมูลผู้สมัครอย่างเป็นทางการของ เขาค้อวิ่งทะลุหมอก มาราธอน 2026
            </p>
          </div>
        </div>
      </div>

      {/* Official Data Source */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-cyan-400 font-bold text-sm">
            <Database className="w-5 h-5" />
            <span>ฐานข้อมูลทางการ: Runlah Participants Official</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            Synced Official
          </span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          รายชื่อผู้ร่วมกิจกรรมทั้งหมด {totalRunners.toLocaleString()} รายการ บันทึกเลข BIB, ชื่อ-นามสกุล, เพศ และประเภทการแข่งขัน ตรวจสอบตรงกับระบบลงทะเบียน Runlah
        </p>
        <a
          href="https://www.runlah.com/th/kkrtmm2026/participants"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-xs text-cyan-400 hover:underline font-semibold"
        >
          เปิดดูหน้า Runlah Participants Official <ExternalLink className="w-3.5 h-3.5 ml-1" />
        </a>
      </div>

      {/* Technical Random Algorithm Standard */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Lock className="w-5 h-5 text-amber-400" />
          อัลกอริทึมการสุ่มและกติกาการแจกรางวัล
        </h3>
        <ul className="space-y-3 text-xs text-slate-300">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong>Cryptographically Uniform Random Selection:</strong> การสุ่มหมายเลข BIB ใช้ฟังก์ชัน Pseudo-Random Uniform distribution บนความจุรวม {totalRunners.toLocaleString()} คน โดยนักวิ่งทุกคนมีโอกาสได้รับรางวัลเท่าเทียมกันทุกประการ</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong>Non-Repeat Rule (ป้องกันการได้รับรางวัลซ้ำ):</strong> เมื่อระบบทำการสุ่มและยืนยันผู้ได้รับรางวัลแล้ว หมายเลข BIB ดังกล่าวจะถูกตัดออกจากโพลการสุ่มทันที เพื่อกระจายรางวัลให้นักวิ่งท่านอื่น</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong>Real-time Verification:</strong> นักวิ่งและผู้สังเกตการณ์สามารถค้นหาและตรวจสอบชื่อ-นามสกุล หมายเลข BIB และสถานะของตนเองได้ตลอดเวลาผ่านหน้าเว็บไซต์</span>
          </li>
        </ul>
      </div>

    </div>
  );
}
