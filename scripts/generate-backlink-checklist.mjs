/**
 * HelpMyIMG — Backlink & Directory Submission Checklist
 * ============================================================
 * This script outputs a prioritized list of directories and
 * communities where HelpMyIMG MUST be listed to build the
 * external link authority that Google requires for fast indexing.
 *
 * CRITICAL INSIGHT:
 * The #1 reason helpmyimg.com is not indexed fast = ZERO backlinks.
 * Google uses external links (PageRank) as the PRIMARY trust signal.
 * Without backlinks, Google de-prioritizes crawling new sites.
 *
 * Time investment: ~2-4 hours to submit to all Tier 1 directories.
 * ROI: First external backlinks can trigger indexing within 24-72 hours.
 *
 * Run: node scripts/generate-backlink-checklist.mjs
 */

const DOMAIN = 'https://helpmyimg.com';
const EN_TOOL = `${DOMAIN}/en/remove-background/`;

const directories = {
  TIER_1: {
    label: '🔥 TIER 1 — IMMEDIATE ACTION (Do these TODAY)',
    note: 'High-authority, instant approval. Free. Google crawls these within hours.',
    items: [
      {
        name: 'Product Hunt',
        url: 'https://www.producthunt.com/posts/new',
        da: 90,
        type: 'Launch',
        instructions: `
  1. Go to producthunt.com and create account
  2. Click "Submit Product"
  3. Name: "HelpMyIMG"
  4. Tagline: "Free AI Image Editor — Remove BG, Compress & Convert Locally"
  5. Website: ${DOMAIN}
  6. Topics: Productivity, Design Tools, Privacy, Developer Tools
  7. First comment: Explain the local WebAssembly processing advantage
  8. Launch on a TUESDAY or WEDNESDAY (best traffic days)`,
        impact: 'CRITICAL — Can drive 500-5000 visitors in day 1. High-authority backlink. Gets mentioned by other blogs.'
      },
      {
        name: 'AlternativeTo',
        url: 'https://alternativeto.net/software/helpmyimg/about/',
        da: 78,
        type: 'Directory',
        instructions: `
  1. Go to alternativeto.net
  2. Click "Add Software"
  3. Name: HelpMyIMG
  4. URL: ${DOMAIN}
  5. Description: "100% free, privacy-first AI image editor. Runs locally in browser using WebAssembly."
  6. Tags: background-removal, image-compression, photo-editing, privacy, free
  7. Mark as alternative to: Remove.bg, TinyPNG, Canva, ILoveIMG, Photoshop
  This is critical — when someone searches "remove.bg alternative" they find you here.`,
        impact: 'CRITICAL — Gets shown to users actively searching for Remove.bg alternatives'
      },
      {
        name: 'Hacker News (Show HN)',
        url: 'https://news.ycombinator.com/submit',
        da: 93,
        type: 'Community',
        instructions: `
  Title: "Show HN: HelpMyIMG – AI background removal that runs 100% locally in browser via WebAssembly"
  URL: ${DOMAIN}
  
  Comment to write: 
  "I built this because I was frustrated by having to upload sensitive photos to cloud services like remove.bg. 
  HelpMyIMG uses MODNet/DIS ONNX models running directly in your browser via WebAssembly + WebGPU. 
  Zero server uploads. Free forever. Supports batch processing of 10 images at once.
  Curious to hear feedback on the local inference approach."
  
  Best time: Monday-Friday, 8-10am EST`,
        impact: 'HIGH — Top HN posts get 1000+ visitors. Tech audience = high-quality backlinks from bloggers who cover it.'
      },
      {
        name: 'Reddit — r/webdev',
        url: 'https://www.reddit.com/r/webdev/submit',
        da: 91,
        type: 'Community',
        instructions: `
  Title: "I built a privacy-first AI image editor that runs 100% in the browser using WebAssembly — no server uploads"
  URL: ${DOMAIN}
  
  Body: Explain the technical approach (WebAssembly, ONNX Runtime, WebGPU), why privacy matters,
  and what makes it different from cloud-based alternatives.`,
        impact: 'HIGH — r/webdev has 3M+ members. Technical audience. Good backlink from reddit.com domain.'
      },
      {
        name: 'Reddit — r/privacy',
        url: 'https://www.reddit.com/r/privacy/submit',
        da: 91,
        type: 'Community',
        instructions: `
  Title: "Free AI image editor that never uploads your photos — runs entirely in browser via WebAssembly"
  URL: ${DOMAIN}
  
  Focus angle: Privacy guarantee, GDPR compliance, zero server storage.`,
        impact: 'HIGH — Privacy-focused audience perfectly matches HelpMyIMG value proposition.'
      }
    ]
  },

  TIER_2: {
    label: '⚡ TIER 2 — HIGH PRIORITY (Do this week)',
    note: 'Curated tool directories with real editorial review. Free or minimal cost.',
    items: [
      {
        name: 'Capterra',
        url: 'https://www.capterra.com/vendors/sign-up',
        da: 87,
        type: 'B2B Directory',
        instructions: 'Category: Photo Editing Software. Claim free listing.',
        impact: 'Strong B2B backlink. Targets businesses needing bulk image processing.'
      },
      {
        name: 'G2',
        url: 'https://sell.g2.com/free-listing',
        da: 89,
        type: 'B2B Directory',
        instructions: 'Category: Image Editing. Free listing available.',
        impact: 'G2 has extremely high DA. Reviews here show up in Google searches for "best image editor".'
      },
      {
        name: 'Futurepedia',
        url: 'https://www.futurepedia.io/submit-tool',
        da: 58,
        type: 'AI Tools Directory',
        instructions: `Submit as: AI Background Remover, AI Image Compressor
Category: Image & Video
Description: "100% browser-local AI image processing via WebAssembly. Background removal, compression, format conversion."`,
        impact: 'Popular AI tools directory. Gets you into "AI image tools" roundup articles.'
      },
      {
        name: 'There\'s An AI For That (TAAFT)',
        url: 'https://theresanaiforthat.com/submit/',
        da: 62,
        type: 'AI Tools Directory',
        instructions: 'Submit under: Image Editing, Privacy Tools categories.',
        impact: 'One of the most trafficked AI tool directories. High organic traffic.'
      },
      {
        name: 'Toolify.ai',
        url: 'https://www.toolify.ai/submit',
        da: 47,
        type: 'AI Tools Directory',
        instructions: 'Submit as AI image processing tool.',
        impact: 'Good for AI tool discovery traffic.'
      },
      {
        name: 'TopAI.tools',
        url: 'https://topai.tools/submit',
        da: 44,
        type: 'AI Tools Directory',
        instructions: 'Submit as background removal + image compression tool.',
        impact: 'Growing AI directory. Multiple categories possible.'
      },
      {
        name: 'AI-Toolhunt',
        url: 'https://www.ai-toolhunt.com/submit-tool',
        da: 40,
        type: 'AI Tools Directory',
        instructions: 'Free submission.',
        impact: 'Growing directory in AI tool niche.'
      }
    ]
  },

  TIER_3: {
    label: '📋 TIER 3 — BACKGROUND SUBMISSIONS (Do over next 2 weeks)',
    note: 'Broader web directories and Indonesian-specific communities.',
    items: [
      {
        name: 'Web.App (Chrome Extensions)',
        url: 'https://web.app/',
        da: 83,
        type: 'Web App Directory',
        instructions: 'Claim your web app listing.',
        impact: 'Good for discovery of browser-based tools.'
      },
      {
        name: 'F6S (Startup)',
        url: 'https://www.f6s.com/startup-profile/',
        da: 55,
        type: 'Startup Directory',
        instructions: 'List as a startup. Free.',
        impact: 'Startup ecosystem backlink.'
      },
      {
        name: 'Kaskus (Indonesian Forum)',
        url: 'https://www.kaskus.co.id/',
        da: 65,
        type: 'Indonesian Community',
        instructions: `
  Post in: Forum Lounge or Komputer & Gadget section
  Title: "Tool edit foto gratis 100% browser, hapus background, kompres foto tanpa upload ke server"
  URL: ${DOMAIN}/id/
  
  Indonesia is HelpMyIMG's #1 traffic market. A Kaskus post can drive massive local traffic.`,
        impact: 'HIGH for Indonesian market — Kaskus is the largest Indonesian forum.'
      },
      {
        name: 'Reddit — r/indoprogram',
        url: 'https://www.reddit.com/r/indoprogram/',
        da: 91,
        type: 'Community (ID)',
        instructions: 'Post about the local WebAssembly processing approach in Bahasa Indonesia.',
        impact: 'Indonesian developer community. Good for ID locale backlink.'
      },
      {
        name: 'GitHub (Open Source mention)',
        url: 'https://github.com/awesome-selfhosted/awesome-selfhosted',
        da: 96,
        type: 'GitHub Awesome List',
        instructions: `
  Submit a PR to awesome lists that cover privacy or image tools:
  - awesome-privacy: https://github.com/pluja/awesome-privacy
  - Describe as: "HelpMyIMG — ${DOMAIN} — 100% client-side AI image processing. No server uploads."`,
        impact: 'GitHub backlinks are extremely high-authority. Developers find and share these.'
      }
    ]
  }
};

// ============================================================================
// OUTPUT
// ============================================================================
console.log('\n' + '='.repeat(70));
console.log('  HelpMyIMG — Backlink & Indexing Strategy Checklist');
console.log('  Generated:', new Date().toLocaleString());
console.log('='.repeat(70));

console.log(`
📊 CURRENT STATUS (estimated):
  • External backlinks: ~0 (CRITICAL issue)
  • Google index status: Not indexed / Discovering
  • IndexNow (Bing/Yandex): ✅ Active
  • Google Sitemap Ping: ✅ Active (after latest build)
  • JSON-LD schemas: ✅ Organization + BreadcrumbList + FAQPage
  
⚠️  ROOT CAUSE: Google requires external authority signals (backlinks) to 
   prioritize crawling new sites. Without them, even perfect technical 
   SEO results in delayed indexing (weeks-months instead of hours-days).
   
🎯 TARGET: 10+ quality backlinks within 2 weeks → Google starts regular crawling.
`);

for (const [tier, data] of Object.entries(directories)) {
  console.log('\n' + '-'.repeat(70));
  console.log(`${data.label}`);
  console.log(`Note: ${data.note}`);
  console.log('-'.repeat(70));

  for (const item of data.items) {
    console.log(`\n📌 ${item.name} [DA: ${item.da}] — ${item.type}`);
    console.log(`   URL: ${item.url}`);
    if (item.instructions) {
      console.log(`   Instructions: ${item.instructions}`);
    }
    console.log(`   💡 Impact: ${item.impact}`);
  }
}

console.log('\n' + '='.repeat(70));
console.log('  QUICK ACTION PLAN (2-week sprint):');
console.log('='.repeat(70));
console.log(`
Week 1 (Days 1-3 — TODAY):
  □ Product Hunt launch (create account, draft post, schedule for Tue/Wed)
  □ AlternativeTo listing (10 minutes)
  □ Show HN post (write carefully, post during US morning)
  □ Reddit r/webdev + r/privacy posts (2 separate posts)
  □ Futurepedia + TAAFT submissions

Week 1 (Days 4-7):
  □ G2 + Capterra free listings
  □ Toolify + TopAI.tools submissions
  □ Kaskus post (Indonesian market)

Week 2:
  □ awesome-privacy GitHub PR submission
  □ F6S startup profile
  □ Follow up on all Tier 1 submissions
  □ Monitor Google Search Console for new indexed URLs

Expected result by end of Week 2:
  → 10-20 external backlinks
  → Google crawl rate increases significantly
  → New pages indexed within 24-72 hours (not weeks)
`);
