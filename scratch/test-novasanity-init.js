const fs = require('fs');

global.window = {
  dispatchEvent: () => {}
};
global.CustomEvent = class { constructor(name, detail) {} };
global.localStorage = {
  getItem: () => null,
  setItem: () => {}
};

require('../sanity-config.js');

async function testInit() {
  console.log('Testing NovaSanity.init()...');
  const prods = await window.NovaSanity.init();
  console.log('NovaSanity ready:', window.NovaSanity._ready);
  console.log('Products count fetched:', prods.length);
  if (prods.length > 0) {
    console.log('First product:', prods[0]);
  }
}

testInit();
