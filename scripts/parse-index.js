const fs = require('fs');
const parser = require('@babel/parser');
const src = fs.readFileSync('pages/index.js', 'utf8');
try {
  parser.parse(src, { sourceType: 'module', plugins: ['jsx'] });
  console.log('ok');
} catch (e) {
  console.error('ERROR', e.message);
  console.error('LOC', JSON.stringify(e.loc));
  process.exit(1);
}
