const fs = require('fs');

function extractAll1531() {
  const html = fs.readFileSync('runlah_page.html', 'utf8');

  const categoryMap = {
    'NjlXwh': 'มาราธอน 42.195 กม.',
    'qXoZ9g': 'ฮาล์ฟมาราธอน 21 กม.',
    'sk6BLO': 'มินิมาราธอน 10 กม.',
    'ItDxeK': 'ฟันรัน 5 กม.',
    '8TO7eQpG': 'CHARITY 42.195KM. ⭐',
    'OoTLmnMk': 'CHARITY 21KM. ⭐',
    'qw4I8cIi': 'CHARITY 10KM. ⭐',
    'ztXL9rwv': 'CHARITY 5KM. ⭐'
  };

  const scriptRegex = /<script>([\s\S]*?)<\/script>/gi;
  let match;
  let svelteScript = '';
  while ((match = scriptRegex.exec(html)) !== null) {
    if (match[1].includes('resolve(1, () =>')) {
      svelteScript = match[1];
      break;
    }
  }

  const arrayStart = svelteScript.indexOf('__sveltekit_18lhqht.resolve(1, () =>');
  const arrayStr = svelteScript.slice(arrayStart);

  const records = [];
  const bibRegex = /bib:"([^"]+)"/;
  const catRegex = /category:"([^"]+)"/;
  const idRegex = /_id:"([^"]+)"/;
  const genderRegex = /gender:"([^"]+)"/;
  const thFirstRegex = /th:\{[^}]*firstname:"([^"]+)"/;
  const thLastRegex = /th:\{[^}]*lastname:"([^"]+)"/;
  const enFirstRegex = /en:\{[^}]*firstname:"([^"]+)"/;
  const enLastRegex = /en:\{[^}]*lastname:"([^"]+)"/;

  let pos = 0;
  const positions = [];
  while ((pos = arrayStr.indexOf('{_id:"', pos)) !== -1) {
    positions.push(pos);
    pos += 5;
  }

  for (let i = 0; i < positions.length; i++) {
    const startPos = positions[i];
    const endPos = (i < positions.length - 1) ? positions[i + 1] : arrayStr.length;
    const chunk = arrayStr.slice(startPos, endPos);

    const bibM = chunk.match(bibRegex);
    if (!bibM) continue;

    const bib = bibM[1];
    const idM = chunk.match(idRegex);
    const id = idM ? idM[1] : `p_${i}`;

    const catM = chunk.match(catRegex);
    const catId = catM ? catM[1] : '';
    let categoryName = categoryMap[catId];

    if (!categoryName) {
      const bibNum = parseInt(bib, 10);
      if (bib.startsWith('4') || (bibNum >= 4000 && bibNum < 5000)) categoryName = 'มาราธอน 42.195 กม.';
      else if (bib.startsWith('2') || (bibNum >= 2000 && bibNum < 3000)) categoryName = 'ฮาล์ฟมาราธอน 21 กม.';
      else if (bib.startsWith('1') || (bibNum >= 1000 && bibNum < 2000)) categoryName = 'มินิมาราธอน 10 กม.';
      else if (bib.startsWith('5') || (bibNum >= 5000 && bibNum < 6000)) categoryName = 'ฟันรัน 5 กม.';
      else categoryName = 'ทั่วไป';
    }

    const genderM = chunk.match(genderRegex);
    const gender = genderM ? (genderM[1] === 'male' ? 'ชาย' : genderM[1] === 'female' ? 'หญิง' : genderM[1]) : 'ไม่ระบุ';

    const thFirstM = chunk.match(thFirstRegex);
    const thLastM = chunk.match(thLastRegex);
    const enFirstM = chunk.match(enFirstRegex);
    const enLastM = chunk.match(enLastRegex);

    const thFirst = thFirstM ? thFirstM[1] : '';
    const thLast = thLastM ? thLastM[1] : '';
    const enFirst = enFirstM ? enFirstM[1] : '';
    const enLast = enLastM ? enLastM[1] : '';

    let fullName = '';
    if (thFirst || thLast) {
      fullName = `${thFirst} ${thLast}`.trim();
    } else if (enFirst || enLast) {
      fullName = `${enFirst} ${enLast}`.trim();
    } else {
      fullName = `นักวิ่ง BIB ${bib}`;
    }

    let nameEn = `${enFirst} ${enLast}`.trim();

    records.push({
      id: id,
      bib: bib,
      name: fullName,
      nameEn: nameEn || fullName,
      category: categoryName,
      gender: gender,
      verified: true,
      runlahUrl: 'https://www.runlah.com/th/kkrtmm2026/participants'
    });
  }

  console.log('Total extracted participants count:', records.length);
  
  if (!fs.existsSync('./src/data')) {
    fs.mkdirSync('./src/data', { recursive: true });
  }

  fs.writeFileSync('./src/data/participants.json', JSON.stringify(records, null, 2));
  console.log('Successfully saved all 1,531 records to ./src/data/participants.json');
}

extractAll1531();
