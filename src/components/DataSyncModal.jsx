import React, { useState } from 'react';
import { X, RefreshCw, Upload, Check, AlertCircle } from 'lucide-react';

export default function DataSyncModal({ isOpen, onClose, onImportCSV, totalCount }) {
  const [csvText, setCsvText] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errMsg, setErrMsg] = useState('');

  if (!isOpen) return null;

  const handleCustomImport = () => {
    setSuccessMsg('');
    setErrMsg('');
    if (!csvText.trim()) {
      setErrMsg('กรุณากรอกหรือวางข้อมูล CSV');
      return;
    }

    try {
      // Parse CSV text (bib, name, category, gender)
      const lines = csvText.split('\n');
      const newParticipants = [];

      lines.forEach((line, idx) => {
        const parts = line.split(',').map(s => s.trim().replace(/^"|"$/g, ''));
        if (parts.length >= 2 && parts[0] && parts[1]) {
          // If first row is header, skip
          if (idx === 0 && (parts[0].toLowerCase().includes('bib') || parts[1].toLowerCase().includes('name'))) {
            return;
          }
          newParticipants.push({
            id: `custom_${Date.now()}_${idx}`,
            bib: parts[0],
            name: parts[1],
            category: parts[2] || 'ทั่วไป',
            gender: parts[3] || 'ไม่ระบุ',
            verified: true
          });
        }
      });

      if (newParticipants.length === 0) {
        setErrMsg('ไม่พบรูปแบบข้อมูลที่ถูกต้อง (ตัวอย่าง: 1001, สมชาย สายวิ่ง, มินิมาราธอน 10 กม., ชาย)');
        return;
      }

      onImportCSV(newParticipants);
      setSuccessMsg(`นำเข้าข้อมูลนักวิ่งสำเร็จจำนวน ${newParticipants.length} รายการ`);
      setCsvText('');
    } catch (e) {
      setErrMsg('เกิดข้อผิดพลาดในการประมวลผล CSV: ' + e.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="glass-card max-w-xl w-full p-6 rounded-3xl border border-slate-800 space-y-6 relative">
        
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-amber-400" />
            จัดการและอัปเดตข้อมูลนักวิ่ง
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-xs text-slate-300 space-y-2 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
          <div className="font-semibold text-emerald-400">
            สถานะปัจจุบัน: มีรายชื่อนักวิ่งในระบบแล้ว {totalCount.toLocaleString()} รายการ
          </div>
          <div>
            ระบบได้รับการโหลดรายชื่อจาก <strong>Runlah Official Participant List (เขาค้อวิ่งทะลุหมอก 2026)</strong> เรียบร้อยแล้ว หากต้องการเพิ่ม BIB หรือนำเข้าตารางใหม่ สามารถวาง CSV ด้านล่างได้
          </div>
        </div>

        {/* CSV input */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            นำเข้าข้อมูลด้วย CSV (รูปแบบ: BIB, ชื่อ-นามสกุล, ระยะทาง, เพศ)
          </label>
          <textarea
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            rows={5}
            placeholder={`ตัวอย่าง:\n1001, สมชาย วิ่งลุยหมอก, มินิมาราธอน 10 กม., ชาย\n5002, สมหญิง ใจสู้, ฟันรัน 5 กม., หญิง`}
            className="w-full p-3 rounded-xl bg-slate-900/90 border border-slate-700 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <Check className="w-4 h-4" />
            {successMsg}
          </div>
        )}

        {errMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {errMsg}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
          >
            ปิด
          </button>
          <button
            onClick={handleCustomImport}
            className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-1.5"
          >
            <Upload className="w-4 h-4" />
            นำเข้าข้อมูล CSV
          </button>
        </div>

      </div>
    </div>
  );
}
