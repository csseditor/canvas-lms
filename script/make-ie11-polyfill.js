const coreJsBuilder = require('core-js-builder')
const fs = require('fs')
const UglifyJS = require('uglify-js')

const FEATURES_TO_POLYFILL=[
  'es6.promise',
  'es6.object.assign',
  'es6.object.is',
  'es6.array',
  'es7.array.includes',
  'es6.function',
  'es6.string.ends-with',
  'es6.string.includes',
  'es6.string.starts-with',
  'es6.symbol'
]
const OUTPUT_FILE = 'public/javascripts/vendor/ie11-polyfill.js'

console.log(`building ${OUTPUT_FILE} to polyfill the following features: ${FEATURES_TO_POLYFILL}`)

coreJsBuilder({
  modules: FEATURES_TO_POLYFILL,
  library: false,
  umd: false
}).then(code => {
  const minifedCode = UglifyJS.minify(code, {fromString: true, warnings: true}).code
  const contents = '//THIS FILE WAS AUTOGENERATED BY script/make-ie11-polyfill.js\n' + minifedCode
  fs.writeFile(OUTPUT_FILE, contents)
}).catch(console.error)
