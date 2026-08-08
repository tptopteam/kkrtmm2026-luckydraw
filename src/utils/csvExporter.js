export function exportWinnersToCSV(winners, filename = 'kkrtmm2026_winners.csv') {
  if (!winners || winners.length === 0) {
    alert('ไม่มีข้อมูลผู้โชคดีสำหรับส่งออก');
    return;
  }

  // Header line
  const headers = ['ลำดับ', 'รางวัล', 'เลข BIB', 'ชื่อ-นามสกุล', 'ระยะทาง/ประเภท', 'เพศ', 'เวลาที่สุ่มได้'];
  
  const rows = winners.map((w, index) => [
    index + 1,
    `"${(w.prize || 'รางวัลทั่วไป').replace(/"/g, '""')}"`,
    `"${w.bib}"`,
    `"${(w.name || '').replace(/"/g, '""')}"`,
    `"${(w.category || '').replace(/"/g, '""')}"`,
    `"${(w.gender || '').replace(/"/g, '""')}"`,
    `"${w.drawnAt || ''}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  
  // Add UTF-8 BOM byte order mark for Excel Thai language support
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
