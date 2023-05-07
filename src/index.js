#!/usr/bin/env node

import { exit, startCountdown, displayTitle, displayQuote, displayInstructions} from './async-readline.js';
import {getQuoteOfTheDay} from './quote.js';

// Time constants in seconds
const FOCUS_TIME = 25 * 60;
const SHORT_BREAK_TIME = 5 * 60;
const LONG_BREAK_TIME = 15 * 60;

const ORDER = [
  'focus',
  'short break',
  'focus',
  'short break',
  'focus',
  'short break',
  'focus',
  'long break',
];

async function pomodoroRunner() {
  let currentCycle = 0;
  const isRunning = true;
  let _exitCode = undefined;
  while(isRunning) {
    displayTitle(ORDER[currentCycle].toUpperCase());
    switch (ORDER[currentCycle]) {
      case 'focus':
        _exitCode = await startCountdown(FOCUS_TIME);
        break;
      case 'short break':
        _exitCode = await startCountdown(SHORT_BREAK_TIME);
        break;
      case 'long break':
        _exitCode = await startCountdown(LONG_BREAK_TIME);
        break;
    }
    if(_exitCode === 0) {
      return;
    }
    if(currentCycle === ORDER.length - 1) {
      currentCycle = 0;
      continue;
    }
    currentCycle++;
  }
}

async function main() {
  console.clear();
  const quote = await getQuoteOfTheDay();
  displayQuote(quote);
  displayInstructions();
  await pomodoroRunner();
}

(async () => {
  await main();
  exit();
  process.exit(0);
})();
