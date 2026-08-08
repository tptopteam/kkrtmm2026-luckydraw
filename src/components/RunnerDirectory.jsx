import React, { useState, useMemo } from 'react';
import { Search, Filter, ShieldCheck, ExternalLink, ChevronLeft, ChevronRight, CheckCircle2, User } from 'lucide-react';

export default function RunnerDirectory({ participants }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('ALL');
  const [selectedGender, setSelectedGender] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Filter runners
  const filteredParticipants = useMemo(() => {
    return participants.filter(p => {
      // Search term
      const matchesSearch =
        p.bib.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.nameEn && p.nameEn.toLowerCase().includes(searchQuery.toLowerCase()));

      // Category filter
      let matchesCat = false;
      if (selectedCat === 'ALL') {
        matchesCat = true;
      } else if (selectedCat === 'CHARITY') {
        matchesCat = p.category.includes('CHARITY');
      } else {
        matchesCat = p.category.includes(selectedCat);
      }

      // Gender filter
      const matchesGender =
        selectedGender === 'ALL' || p.gender === selectedGender;

      return matchesSearch && matchesCat && matchesGender;
    });
  }, [participants, searchQuery, selectedCat, selectedGender]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredParticipants.length / itemsPerPage) || 1;
  const paginatedParticipants = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredParticipants.slice(start, start + itemsPerPage);
  }, [filteredParticipants, currentPage]);

  const handleCatChange = (cat) => {
    setSelectedCat(cat);
    setCurrentPage(1);
  };

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = {
      ALL: participants.length,
      '42.195': participants.filter(p => p.category.includes('42.195')).length,
      '21': participants.filter(p => p.category.includes('21')).length,
      '10': participants.filter(p => p.category.includes('10')).length,
      '5': participants.filter(p => p.category.includes('5')).length,
      'CHARITY': participants.filter(p => p.category.includes('CHARITY')).length
    };
    return counts;
  }, [participants]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Category Stats Overview Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <button
          onClick={() => handleCatChange('ALL')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            selectedCat === 'ALL'
              ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-500/10'
              : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <div className="text-xs font-semibold uppercase">ทั้งหมด</div>
          <div className="text-2xl font-black text-white mt-1">{categoryCounts.ALL} <span className="text-xs font-normal text-slate-400">คน</span></div>
        </button>

        <button
          onClick={() => handleCatChange('42.195')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            selectedCat === '42.195'
              ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-500/10'
              : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <div className="text-xs font-semibold uppercase text-indigo-400">42.195 กม. (รวม Charity)</div>
          <div className="text-2xl font-black text-white mt-1">{categoryCounts['42.195']} <span className="text-xs font-normal text-slate-400">คน</span></div>
        </button>

        <button
          onClick={() => handleCatChange('21')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            selectedCat === '21'
              ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-500/10'
              : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <div className="text-xs font-semibold uppercase text-rose-400">21 กม.</div>
          <div className="text-2xl font-black text-white mt-1">{categoryCounts['21']} <span className="text-xs font-normal text-slate-400">คน</span></div>
        </button>

        <button
          onClick={() => handleCatChange('10')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            selectedCat === '10'
              ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-500/10'
              : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <div className="text-xs font-semibold uppercase text-teal-400">10 กม.</div>
          <div className="text-2xl font-black text-white mt-1">{categoryCounts['10']} <span className="text-xs font-normal text-slate-400">คน</span></div>
        </button>

        <button
          onClick={() => handleCatChange('5')}
          className={`p-4 rounded-2xl border text-left transition-all col-span-2 sm:col-span-1 ${
            selectedCat === '5'
              ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-500/10'
              : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <div className="text-xs font-semibold uppercase text-amber-400">5 กม.</div>
          <div className="text-2xl font-black text-white mt-1">{categoryCounts['5']} <span className="text-xs font-normal text-slate-400">คน</span></div>
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="glass-card p-4 sm:p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="ค้นหาตามชื่อ-นามสกุล หรือ เลข BIB (เช่น 401, ธิติสรณ์)..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium"
            />
          </div>

          {/* Gender Filter */}
          <select
            value={selectedGender}
            onChange={(e) => { setSelectedGender(e.target.value); setCurrentPage(1); }}
            className="px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium"
          >
            <option value="ALL">ทุกเพศ (All Genders)</option>
            <option value="ชาย">ชาย (Male)</option>
            <option value="หญิง">หญิง (Female)</option>
          </select>

        </div>

        {/* Results summary bar */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
          <div>
            พบรายชื่อนักวิ่ง <span className="text-emerald-400 font-bold">{filteredParticipants.length.toLocaleString()}</span> รายการ
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>ซิงค์ตรงกับระบบ Runlah Official List</span>
          </div>
        </div>
      </div>

      {/* Participants Directory Table */}
      <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/90 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-4 px-6">เลข BIB</th>
                <th className="py-4 px-6">ชื่อ-นามสกุล นักวิ่ง</th>
                <th className="py-4 px-6">ระยะทาง / ประเภท</th>
                <th className="py-4 px-6">เพศ</th>
                <th className="py-4 px-6">สถานะการยืนยัน</th>
                <th className="py-4 px-6 text-right">ลิงก์ตรวจสอบ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {paginatedParticipants.length > 0 ? (
                paginatedParticipants.map((runner) => (
                  <tr key={runner.id || runner.bib} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6 font-mono text-base font-black text-emerald-400">
                      {runner.bib}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-white">{runner.name}</div>
                      {runner.nameEn && runner.nameEn !== runner.name && (
                        <div className="text-xs text-slate-500 font-mono">{runner.nameEn}</div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${
                        runner.category.includes('42') ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30' :
                        runner.category.includes('21') ? 'bg-rose-500/10 text-rose-300 border-rose-500/30' :
                        runner.category.includes('10') ? 'bg-teal-500/10 text-teal-300 border-teal-500/30' :
                        'bg-amber-500/10 text-amber-300 border-amber-500/30'
                      }`}>
                        {runner.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-300">
                      {runner.gender}
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center text-xs text-emerald-400 font-medium">
                        <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-400" />
                        ยืนยันความถูกต้อง
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <a
                        href={runner.runlahUrl || 'https://www.runlah.com/th/kkrtmm2026/participants'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-xs text-cyan-400 hover:text-cyan-300 font-medium hover:underline"
                      >
                        Runlah <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-500">
                    ไม่พบข้อมูลรายชื่อนักวิ่งตามเงื่อนไขที่ค้นหา
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 bg-slate-900/90 border-t border-slate-800 text-xs text-slate-400">
            <div>
              หน้า <span className="text-white font-bold">{currentPage}</span> จาก <span className="text-white font-bold">{totalPages}</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
