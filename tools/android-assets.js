#!/usr/bin/env node
// Copies the game into the Android app (android/app/src/main/assets/game), so the app works without internet.
// Run before building the app: node tools/android-assets.js (the Android workflow does this). See docs/android.md.
'use strict';
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const out = path.join(root, 'android', 'app', 'src', 'main', 'assets', 'game');
const files = ['index.html', 'privacy.html', 'manifest.webmanifest', 'sw.js', 'css', 'js', 'lang', 'scenes', 'portraits', 'icons'];
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
for (const f of files) fs.cpSync(path.join(root, f), path.join(out, f), { recursive: true });
console.log('The game is in ' + path.relative(root, out));
