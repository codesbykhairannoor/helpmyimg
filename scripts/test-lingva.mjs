import pkg from 'lingva-scraper';
const { lingva } = pkg;

async function test() {
  try {
    const res = await lingva('en', 'es', 'Hello world');
    console.log('Success:', res.text);
  } catch(e) {
    console.error('Error:', e.message);
  }
}
test();
