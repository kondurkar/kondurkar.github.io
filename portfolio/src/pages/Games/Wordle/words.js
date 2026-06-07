// src/pages/Games/Wordle/words.js
// 100 common 5-letter words for the Wordle clone

export const WORDS = [
  "react","build","clone","style","debug","fetch","hooks","redux","props","state",
  "class","async","await","error","stack","cache","store","modal","event","array",
  "focus","input","query","route","scope","token","types","union","valid","value",
  "block","child","clone","const","defer","draft","entry","field","grant","guard",
  "index","label","layer","limit","links","local","logic","match","media","model",
  "mount","parse","patch","plain","plain","proxy","queue","quite","range","ready",
  "reset","round","scale","shape","share","shift","shown","slice","solid","split",
  "start","steps","store","strip","style","table","tasks","theme","title","toast",
  "trace","track","trial","trust","tuple","ultra","union","unity","until","upper",
  "utils","video","views","watch","width","world","write","yield","zones","about",
];

export const VALID_GUESSES = [
  ...WORDS,
  "words","crane","slate","raise","audio","adieu","stare","arose","least","later",
  "alter","alert","arise","irate","snare","learn","renal","liner","liter","litre",
  "elite","inert","inter","trice","nicer","since","spine","snipe","swine","twine",
  "tribe","brine","bride","gripe","price","pride","prime","prior","print","prose",
  "prove","prowl","prune","pulls","pulse","punch","pupil","point","plait","plain",
  "plane","plant","plate","plaza","plead","pleat","plumb","plume","plunk","plush",
  "poker","polar","polka","polyp","poppy","porch","porta","posed","poser","potty",
];

export function getRandomWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)].toUpperCase();
}

export function isValidGuess(word) {
  return VALID_GUESSES.includes(word.toLowerCase());
}
