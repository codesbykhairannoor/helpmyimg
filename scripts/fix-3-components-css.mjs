import fs from 'fs';
import path from 'path';

// Fix Compress50kbSections
const c50 = path.resolve('src/components/landing/tools/Compress50kbSections.tsx');
let c50Text = fs.readFileSync(c50, 'utf-8');
c50Text = c50Text.replace(/text-zinc-500/g, 'text-zinc-300');
c50Text = c50Text.replace(/text-zinc-400/g, 'text-zinc-200');
fs.writeFileSync(c50, c50Text);

// Fix Compress200kbSections
const c200 = path.resolve('src/components/landing/tools/Compress200kbSections.tsx');
let c200Text = fs.readFileSync(c200, 'utf-8');
c200Text = c200Text.replace(
  'className="w-full flex flex-col items-center gap-16 py-12 font-mono"',
  'className="w-full flex flex-col items-center gap-16 py-12 font-mono bg-zinc-950 text-white"'
);
fs.writeFileSync(c200, c200Text);

// Fix RemoveLogoSections
const rl = path.resolve('src/components/landing/tools/RemoveLogoSections.tsx');
let rlText = fs.readFileSync(rl, 'utf-8');
rlText = rlText.replace(
  'className="text-lg text-indigo-200/70 mb-8"',
  'className="text-lg text-slate-600 dark:text-indigo-200/70 mb-8"'
);
fs.writeFileSync(rl, rlText);

console.log('Fixed CSS in 3 components!');
