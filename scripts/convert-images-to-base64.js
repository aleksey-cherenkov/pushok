/**
 * Convert project photos to base64 data URLs
 * Run: node scripts/convert-images-to-base64.js
 */

const fs = require('fs');
const path = require('path');

const images = [
  { file: 'room-before.jpg', label: 'Planning Phase - Before' },
  { file: 'room-during.jpg', label: 'Furniture Phase - In Progress' },
  { file: 'room-done.jpg', label: 'Setup Phase - Completed' },
];

console.log('Converting images to base64...\n');

images.forEach(({ file, label }) => {
  const filePath = path.join(__dirname, '..', 'images', file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${file}`);
    return;
  }

  const buffer = fs.readFileSync(filePath);
  const base64 = buffer.toString('base64');
  const mimeType = file.endsWith('.jpg') || file.endsWith('.JPG') ? 'image/jpeg' : 'image/png';
  const dataUrl = `data:${mimeType};base64,${base64}`;
  
  const sizeKB = (buffer.length / 1024).toFixed(1);
  const base64SizeKB = (dataUrl.length / 1024).toFixed(1);
  
  console.log(`✅ ${label}`);
  console.log(`   File: ${file}`);
  console.log(`   Original: ${sizeKB} KB`);
  console.log(`   Base64: ${base64SizeKB} KB`);
  console.log(`   Preview: ${dataUrl.substring(0, 60)}...`);
  console.log('');
});

// Output to file for easy copy-paste
const output = images.map(({ file, label }, idx) => {
  const filePath = path.join(__dirname, '..', 'images', file);
  const buffer = fs.readFileSync(filePath);
  const base64 = buffer.toString('base64');
  const mimeType = file.endsWith('.jpg') || file.endsWith('.JPG') ? 'image/jpeg' : 'image/png';
  const dataUrl = `data:${mimeType};base64,${base64}`;
  
  return `// ${label}
const photo${idx + 1}Data = '${dataUrl}';
`;
}).join('\n');

fs.writeFileSync(path.join(__dirname, 'photo-base64-data.js'), output);
console.log('\n✅ Full base64 data written to: scripts/photo-base64-data.js');
console.log('Copy the variables from that file to update seed-and-record.spec.ts');
