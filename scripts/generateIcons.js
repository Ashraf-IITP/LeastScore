// scripts/generateIcons.js
// Generates Android mipmap icons and a web manifest icon from images/logo2.png
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const SRC = path.resolve(__dirname, '../images/logo2.png');
const RES = path.resolve(__dirname, '../android/app/src/main/res');
const PUBLIC = path.resolve(__dirname, '../public');

const ANDROID_SIZES = [
  { dir: 'mipmap-mdpi',    size: 48  },
  { dir: 'mipmap-hdpi',    size: 72  },
  { dir: 'mipmap-xhdpi',   size: 96  },
  { dir: 'mipmap-xxhdpi',  size: 144 },
  { dir: 'mipmap-xxxhdpi', size: 192 },
];

async function run() {
  if (!fs.existsSync(SRC)) {
    console.error('❌  Source not found:', SRC);
    process.exit(1);
  }

  // Android mipmap icons
  for (const { dir, size } of ANDROID_SIZES) {
    const dest = path.join(RES, dir, 'ic_launcher.png');
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    await sharp(SRC).resize(size, size).png().toFile(dest);
    console.log(`✅  ${dir}/ic_launcher.png  (${size}×${size})`);
  }

  // Also write round icons (same image, same sizes — Android uses them on some launchers)
  for (const { dir, size } of ANDROID_SIZES) {
    const dest = path.join(RES, dir, 'ic_launcher_round.png');
    await sharp(SRC).resize(size, size).png().toFile(dest);
    console.log(`✅  ${dir}/ic_launcher_round.png  (${size}×${size})`);
  }

  // Web manifest 512×512
  const webDest = path.join(PUBLIC, 'icon-512.png');
  await sharp(SRC).resize(512, 512).png().toFile(webDest);
  console.log('✅  public/icon-512.png  (512×512)');

  console.log('\n🎉  All icons generated successfully.');
}

run().catch(err => { console.error('❌', err); process.exit(1); });
