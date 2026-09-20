import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

function createPng(width, height, isMaskable = false) {
  // Generate RGBA pixel data
  const rowLength = width * 4 + 1; // +1 for filter byte (0)
  const rawData = Buffer.alloc(rowLength * height);

  const bgR = 15, bgG = 23, bgB = 42; // #0f172a
  const emR = 16, emG = 185, emB = 129; // #10b981
  const blueR = 56, blueG = 189, blueB = 248; // #38bdf8
  const whiteR = 248, whiteG = 250, whiteB = 252; // #f8fafc

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowLength;
    rawData[rowOffset] = 0; // None filter

    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;

      // Coordinate normalized -1 to 1
      const nx = (x / width) * 2 - 1;
      const ny = (y / height) * 2 - 1;
      const dist = Math.hypot(nx, ny);

      // Rounded rectangle body or inner symbol
      let r = bgR, g = bgG, b = bgB, a = 255;

      // Calc frame (safe zone)
      const inBox = Math.abs(nx) < 0.65 && Math.abs(ny) < 0.65;
      const onBorder = (Math.abs(nx) >= 0.62 && Math.abs(nx) <= 0.65 && Math.abs(ny) <= 0.65) ||
                       (Math.abs(ny) >= 0.62 && Math.abs(ny) <= 0.65 && Math.abs(nx) <= 0.65);

      // Display bar at top of calc
      const inDisplay = Math.abs(nx) < 0.5 && ny > -0.55 && ny < -0.3;

      // 4 quadrant symbols: +, -, *, =
      // Top-left: Plus
      const inPlus = Math.abs(nx + 0.25) < 0.12 && Math.abs(ny + 0.05) < 0.12 &&
                     (Math.abs(nx + 0.25) < 0.04 || Math.abs(ny + 0.05) < 0.04);
      // Top-right: Minus
      const inMinus = Math.abs(nx - 0.25) < 0.12 && Math.abs(ny + 0.05) < 0.04;
      // Bottom-left: Multiply
      const inTimes = Math.abs(nx + 0.25) < 0.12 && Math.abs(ny - 0.3) < 0.12 &&
                      Math.abs(Math.abs(nx + 0.25) - Math.abs(ny - 0.3)) < 0.04;
      // Bottom-right: Equals
      const inEquals = Math.abs(nx - 0.25) < 0.12 &&
                       (Math.abs(ny - 0.26) < 0.03 || Math.abs(ny - 0.34) < 0.03);

      if (inDisplay) {
        r = 30; g = 41; b = 59; // Slate 800
      } else if (inPlus || inMinus || inTimes) {
        r = blueR; g = blueG; b = blueB;
      } else if (inEquals) {
        r = emR; g = emG; b = emB;
      } else if (onBorder) {
        r = emR; g = emG; b = emB; a = 200;
      } else if (!isMaskable && dist > 0.95) {
        a = 0; // transparent corner if not maskable
      }

      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  // Compress using zlib
  const compressed = zlib.deflateSync(rawData);

  // Assemble PNG chunks
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);

    const typeBuf = Buffer.from(type);
    const crcBuf = Buffer.alloc(4);
    
    // CRC calculation
    const toCrc = Buffer.concat([typeBuf, data]);
    const crc = crc32(toCrc);
    crcBuf.writeUInt32BE(crc >>> 0, 0);

    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  // CRC32 table
  function crc32(buf) {
    let c = 0 ^ (-1);
    for (let i = 0; i < buf.length; i++) {
      c = (c >>> 8) ^ table[(c ^ buf[i]) & 0xff];
    }
    return (c ^ (-1)) >>> 0;
  }

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // color type RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace

  const ihdrChunk = makeChunk('IHDR', ihdrData);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Generate CRC Table
const table = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  table[n] = c;
}

const outDir = path.resolve('public');
fs.writeFileSync(path.join(outDir, 'pwa-192x192.png'), createPng(192, 192, false));
fs.writeFileSync(path.join(outDir, 'pwa-512x512.png'), createPng(512, 512, false));
fs.writeFileSync(path.join(outDir, 'pwa-maskable-512x512.png'), createPng(512, 512, true));
fs.writeFileSync(path.join(outDir, 'apple-touch-icon.png'), createPng(180, 180, false));
fs.writeFileSync(path.join(outDir, 'favicon.ico'), createPng(32, 32, false));

console.log('Successfully generated all PWA PNG icons!');
