import translate from 'translate-google';

async function test() {
  try {
    const res = await translate('Hello world, this is a test', {to: 'id'});
    console.log(res);
  } catch (err) {
    console.error(err);
  }
}
test();
