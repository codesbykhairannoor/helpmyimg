## Content Generation Guidelines
- **SEO & Informational Pages**: Whenever asked to generate informational pages (About, Privacy, Terms, FAQ, etc.) or landing pages, they MUST be extremely long, comprehensive, and highly detailed. 
- **Minimum Threshold**: Aim for a minimum of 200 lines of robust content per page.
- **SEO Focus**: Ensure content is rich in semantic HTML, uses deep header structures (H1, H2, H3), and incorporates variations of target keywords naturally.
- **Translations**: Always ensure that all massive text blocks are properly tokenized for internationalization (i18n) and fully translated into all supported languages without leaving English fallbacks.

## UI Layout Rules
- **Image Comparison Sliders**: When building Before/After image sliders, the slider container MUST perfectly mimic the dimensions and constraints (e.g., `max-w-full max-h-full`) of the single image it replaces. 
- Avoid wrapping sliders in greedy `w-full h-full` containers unless specifically requested.
- Use CSS Grid (`display: grid`) with overlapping cells (`col-start-1 row-start-1`) to stack images natively without absolute positioning hacks that break intrinsic aspect ratios.

## Translation Guidelines
- **Mandatory Library Usage:** Do NOT use external API fetching tools, curl commands, or custom web scrapers (like lingva) for translating files. 
- **Preferred Library:** Always use the pre-installed `google-translate-api-x` library (`require('google-translate-api-x')`) for any bulk translation scripts. It is fast, supports array batching, and does not require an API key.
