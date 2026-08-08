const fs = require('fs');

function refine() {
  const html = fs.readFileSync('runlah_page.html', 'utf8');
  
  // Find category definitions in script or html
  // Look for category strings like "42.195", "21", "10", "5"
  const catMatches = [...html.matchAll(/_id:"([a-zA-Z0-9_]+)"[^}]*name:\{en:"([^"]+)",th:"([^"]+)"\}/g)];
  const categoryMap = {};
  catMatches.forEach(m => {
    categoryMap[m[1]] = m[3] || m[2];
  });
  
  console.log('Categories found:', categoryMap);

  // Also look for divisions/groups
  const divMatches = [...html.matchAll(/_id:"([a-zA-Z0-9_]+)",name:\{en:"([^"]+)",th:"([^"]+)"\}/g)];
  divMatches.forEach(m => {
    if (!categoryMap[m[1]]) categoryMap[m[1]] = m[3] || m[2];
  });
  console.log('All mappings found:', categoryMap);

  // Parse items
  const svelteScript = html.match(/<script>([\s\S]*?)<\/script>/gi).find(s => s.includes('resolve(1, () =>'));

  const itemRegex = /\{_id:"([^"]+)",category:"([^"]+)",(?:division:\{[^}]*\},)?(?:team:[^,]*,)?bib:"([^"]+)",members:\[\{name:\{en:\{firstname:"([^"]*)",lastname:"([^"]*)"\},th:\{(?:firstname:"([^"]*)",lastname:"([^"]*)")?[^}]*\},l:(?:true|false)\},gender:"([^"]*)"/g;

  const records = [];
  let item;
  while ((item = itemRegex.exec(svelteScript)) !== null) {
    const catId = item[2];
    let categoryName = categoryMap[catId] || 'มาราธอน';
    const bib = item[3];
    const enFirst = item[4];
    const enLast = item[5];
    const thFirst = item[6] || '';
    const thLast = item[7] || '';
    const gender = item[8] === 'male' ? 'ชาย' : item[8] === 'female' ? 'หญิง' : item[8];

    // Infer category by BIB prefix if catId isn't found
    if (!categoryMap[catId]) {
      const bibNum = parseInt(bib, 10);
      if (bib.startsWith('4') || (bibNum >= 4000 && bibNum < 5000)) categoryName = 'มาราธอน 42.195 กม.';
      else if (bib.startsWith('2') || (bibNum >= 2000 && bibNum < 3000)) categoryName = 'ฮาล์ฟมาราธอน 21 กม.';
      else if (bib.startsWith('1') || (bibNum >= 1000 && bibNum < 2000)) categoryName = 'มินิมาราธอน 10 กม.';
      else if (bib.startsWith('5') || (bibNum >= 5000 && bibNum < 6000)) categoryName = 'ฟันรัน 5 กม.';
      else categoryName = 'ทั่วไป';
    }

    const fullName = (thFirst && thLast) ? `${thFirst} ${thLast}` : `${enFirst} ${enLast}`;

    records.push({
      id: item[1],
      bib: bib,
      name: fullName.trim(),
      nameEn: `${enFirst} ${enLast}`.trim(),
      category: categoryName,
      gender: gender,
      verified: true,
      runlahUrl: 'https://www.runlah.com/th/kkrtmm2026/participants'
    });
  }

  console.log('Total records parsed:', records.length);
  // Create dir if needed
  if (!fs.existsSync('./data')) fs.mkdirSync('./data');
  fs.writeFileSync('./data/participants.json', JSON.stringify(records, null, 2));
  console.log('Saved to ./data/participants.json');
}

refine();
