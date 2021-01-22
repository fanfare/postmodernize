#!/usr/bin/env node

const btoa = require('btoa')
const btoaUTF8=function(c,b){"use strict";return function(a,d){return c((d?"\u00ef\u00bb\u00bf":"")+a.replace(/[\x80-\uD7ff\uDC00-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]?/g,b))}}(btoa,function(c){return function(b){var a=b.charCodeAt(0);if(55296<=a&&56319>=a)if(b=b.charCodeAt(1),b===b&&56320<=b&&57343>=b){if(a=1024*(a-55296)+b-56320+65536,65535<a)return c(240|a>>>18,128|a>>>12&63,128|a>>>6&63,128|a&63)}else return c(239,191,189);return 127>=a?inputString:2047>=a?c(192|a>>>6,128|a&63):c(224|a>>>12,128|a>>>6&63,
128|a&63)}}(String.fromCharCode))

const path = require('path')
const fs = require('fs')
const dir = "./public"
if (!fs.existsSync(dir)){
  fs.mkdirSync(dir)
}

let args = process.argv.slice(2)

let blue = fs.readFileSync(args[0])
blue = blue.toString("utf8")
blue = btoaUTF8(blue)

let exp = randstring(8)
let jaz = fs.readFileSync(path.join(__dirname, '../lib/jquery.js'))

fs.writeFileSync(`./public/src._${exp}.html`, `<html><head><meta name="viewport" content="width=device-width"></head><body><div id="app"></div><script src="./src._${exp}.js"></script></body></html>`)
fs.writeFileSync(`./public/src._${exp}.js`, ``)
fs.appendFileSync(`./public/src._${exp}.js`, jaz.toString("utf8"))
fs.appendFileSync(`./public/src._${exp}.js`, `;const html="${blue}";$('body').html(atobUTF8(html))`)
fs.appendFileSync(`./public/src._${exp}.js`, ``)

let target = fs.readFileSync(`./public/src._${exp}.js`)
target = target.toString("utf8")
console.error(`Postmodernizing ${args[0]}.. please wait a minute..`)

const jso = require('javascript-obfuscator')
let obf = jso.obfuscate(target, {
  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 1,
  numbersToExpressions: true,
  deadCodeInjection: true,
  deadCodeInjectionThreshold: 1,
  simplify: true,
  shuffleStringArray: true,
  splitStrings: true,
  stringArrayThreshold: 1
})

function randstring(length) {
  if (!length) {length = 1}
  var text = ''
  var possible = 'abcdef1234567890'
  for (var i = 0; i < length; i++) {
    text += possible[Math.floor(Math.random() * possible.length)]
  }
  return text
}


let modern = fs.readFileSync(path.join(__dirname, '../lib/modern.js'))

fs.writeFileSync(`./public/src._${exp}.js`, modern.toString("utf8"))
fs.appendFileSync(`./public/src._${exp}.js`, obf.getObfuscatedCode())
console.error(`Finished. Results in: 
  ./public/src._${exp}.html
  ./public/src._${exp}.js`)
