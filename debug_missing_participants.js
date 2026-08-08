const fs = require('fs');

function debugMissing() {
  const html = fs.readFileSync('runlah_page.html', 'utf8');

  // Find the Svelte data script
  const scriptRegex = /<script>([\s\S]*?)<\/script>/gi;
  let match;
  let svelteScript = '';
  while ((match = scriptRegex.exec(html)) !== null) {
    if (match[1].includes('resolve(1, () =>')) {
      svelteScript = match[1];
      break;
    }
  }

  // Let's count how many bib:"..." occurrences are in svelteScript
  const allBibs = [...svelteScript.matchAll(/bib:"([^"]+)"/g)].map(m => m[1]);
  console.log('Total bib:"..." occurrences in script:', allBibs.length);

  // Let's check how many _id occurrences are in the participant array
  // The participant array starts with `__sveltekit_18lhqht.resolve(1, () => [[`
  const arrayStart = svelteScript.indexOf('__sveltekit_18lhqht.resolve(1, () =>');
  if (arrayStart !== -1) {
    const arrayStr = svelteScript.slice(arrayStart);
    const idMatches = [...arrayStr.matchAll(/_id:"([^"]+)"/g)].map(m => m[1]);
    console.log('Total _id in arrayStr:', idMatches.length);
  }

  // Let's test a broader regex for participant objects
  // Some objects might have missing fields or different structures (e.g., team, no english name, no last name, or diff members format)
  // Let's inspect objects that didn't match itemRegex in our previous script
}

debugMissing();
