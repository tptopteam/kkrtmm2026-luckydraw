const fs = require('fs');

function debugMissing() {
  const html = fs.readFileSync('runlah_page.html', 'utf8');

  // Find script
  const scriptRegex = /<script>([\s\S]*?)<\/script>/gi;
  let match;
  let svelteScript = '';
  while ((match = scriptRegex.exec(html)) !== null) {
    if (match[1].includes('resolve(1, () =>')) {
      svelteScript = match[1];
      break;
    }
  }

  // Count bib:"..." occurrences
  const allBibs = [...svelteScript.matchAll(/bib:"([^"]+)"/g)].map(m => m[1]);
  console.log('Total bib:"..." occurrences in script:', allBibs.length);

  // Let's inspect the participant array objects!
  // Notice in SvelteKit data, objects in the array look like:
  // {_id:"...",category:"...",division:{...},team:...,bib:"...",members:[...]}
  // Let's extract all objects containing bib:"..."
  
  // Cut array string
  const arrayStart = svelteScript.indexOf('__sveltekit_18lhqht.resolve(1, () =>');
  const arrayStr = svelteScript.slice(arrayStart);

  // Split by {_id:" or match all objects with bib:
  // Let's test matching bib:"(\d+)"
  const matches = [...arrayStr.matchAll(/bib:"(\d+)"/g)];
  console.log('Total bib numbers matched:', matches.length);

  // Let's inspect what fields exist on records that failed our previous regex!
  // Let's parse objects properly without assuming exact key order or fixed structure.
  
  // Find all participant objects by regex
  // Object starts with {_id:"..." and has bib:"..."
  const objectRegex = /\{_id:"[a-zA-Z0-9_]+",category:"[a-zA-Z0-9_]+",[\s\S]*?bib:"(\d+)"[\s\S]*?members:\[\{[\s\S]*?\}\]\}/g;

  // Let's inspect how many objects we get if we search for bib
  const bibPositions = [];
  let pos = 0;
  while ((pos = arrayStr.indexOf('bib:"', pos)) !== -1) {
    bibPositions.push(pos);
    pos += 5;
  }
  console.log('Found bib positions count:', bibPositions.length);
}

debugMissing();
