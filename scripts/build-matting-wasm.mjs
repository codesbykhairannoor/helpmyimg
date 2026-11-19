import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const srcC = path.join(root, 'src', 'wasm', 'matting_engine.c');
const outDir = path.join(root, 'src', 'assets');
const tmpObj = path.join(root, 'src', 'wasm', 'matting_engine.o');
const outWasm = path.join(outDir, 'matting_engine.wasm');

fs.mkdirSync(outDir, { recursive: true });

execFileSync('clang', [
  '--target=wasm32',
  '-O3',
  '-ffast-math',
  '-nostdlib',
  '-c',
  srcC,
  '-o',
  tmpObj,
], { stdio: 'inherit' });

execFileSync('wasm-ld', [
  '--no-entry',
  '--export-dynamic',
  '--initial-memory=1048576',
  '--max-memory=1073741824',
  '-o',
  outWasm,
  tmpObj,
], { stdio: 'inherit' });

fs.unlinkSync(tmpObj);
const stats = fs.statSync(outWasm);
console.log(`Built ${outWasm} (${stats.size} bytes)`);
