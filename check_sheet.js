const fs = require('fs');

function parseRunlahData() {
  const html = fs.readFileSync('runlah_page.html', 'utf8');
  
  // Extract all script content
  const scripts = [];
  const regex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    scripts.push(match[1]);
  }
  
  const svelteScript = scripts.find(s => s.includes('resolve(1, () =>'));
  if (!svelteScript) {
    console.log('No svelte script found');
    return;
  }
  
  // Look for bib occurrences
  const bibMatches = [...svelteScript.matchAll(/bib:"([^"]+)"/g)].map(m => m[1]);
  console.log('Total BIBs found:', bibMatches.length);
  console.log('Sample BIBs:', bibMatches.slice(0, 10));

  // Extract category mapping if available
  const catMatches = [...svelteScript.matchAll(/_id:"([^"]+)",name:\{en:"([^"]+)",th:"([^"]+)"\}/g)];
  console.log('Categories found:', catMatches.map(m => ({ id: m[1], th: m[3] })));
}

parseRunlahData();
