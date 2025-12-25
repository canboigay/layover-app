const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

async function convertSvgToPng(size, outputPath) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Read and render SVG
  const svgContent = fs.readFileSync('public/icon.svg', 'utf8');
  const img = await loadImage(`data:image/svg+xml;base64,${Buffer.from(svgContent).toString('base64')}`);
  
  ctx.drawImage(img, 0, 0, size, size);
  
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);
  console.log(`Created ${outputPath}`);
}

(async () => {
  try {
    await convertSvgToPng(192, 'public/icon-192.png');
    await convertSvgToPng(512, 'public/icon-512.png');
  } catch (err) {
    console.error('Error:', err.message);
  }
})();
