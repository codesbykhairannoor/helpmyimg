const fs = require('fs');
const pages = [
  { name: 'AboutPage', key: 'footer.about' },
  { name: 'PrivacyPage', key: 'footer.privacy' },
  { name: 'TermsPage', key: 'footer.terms' },
  { name: 'FaqPage', key: 'nav.faq' },
  { name: 'SecurityPage', key: 'footer.security' },
  { name: 'PricingPage', key: 'footer.pricing' },
  { name: 'ComparePage', key: 'footer.compare' },
  { name: 'LanguagesPage', key: 'footer.languages' }
];

pages.forEach(p => {
  const file = 'src/pages/info/' + p.name + '.tsx';
  let content = fs.readFileSync(file, 'utf8');
  
  // Create the exact string: <title>{`${t('KEY')} | HelpMyIMG`}</title>
  const exactTitle = '<title>{`${t(\'' + p.key + '\')} | HelpMyIMG`}</title>';
  
  content = content.replace(/<title>\{.*\| HelpMyIMG\}<\/title>/g, exactTitle);
  content = content.replace(/<title>\{.*\$\{t\('.*?'\)\}.*HelpMyIMG\}<\/title>/g, exactTitle);
  
  fs.writeFileSync(file, content, 'utf8');
  console.log('Fixed', p.name);
});
