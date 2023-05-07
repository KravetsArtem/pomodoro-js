import readline from 'readline';
import {StyleEscapeCodes} from './output-styling.js';

const RL = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '',
  terminal: true,
});

let RUNNING = false;
let SKIP = false;
let _quit = false;

const writeLine = (lineNumber, text) => {
  readline.cursorTo(process.stdout, 0, lineNumber);
  readline.clearLine(process.stdout, 0);
  process.stdout.write(text);

  readline.cursorTo(process.stdout, 0, 5);
};

export const displayQuote = (quote) => {
  const {Italic, Colors, Reset} = StyleEscapeCodes;
  writeLine(2, `${Italic}Quote of the day: ${Colors.Yellow}${quote}${Reset}`);
};

export const displayTitle = (title) => {
  const {Bold, Reset} = StyleEscapeCodes;
  writeLine(0, `${Reset}${Bold}${title}`);
};

export const displayInstructions = () => {
  const {Bold, Italic} = StyleEscapeCodes;
  writeLine(3, `${Bold}${Italic}${!RUNNING ? '\'r\' => start the timer | ' : ''}'s' => skip to the next phase | 'p' => pause/resume the timer | 'q' => quit`);
};

const displayTimer = (timeSeconds) => {
  const {Bold, FontSize} = StyleEscapeCodes;
  const minutes = Math.floor(timeSeconds / 60);
  const seconds = timeSeconds % 60;
  writeLine(1, `${Bold}${FontSize.Large}${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`);
};

export const startCountdown = async (seconds) => {
  displayTimer(seconds);
  let _stop = false;

  const interval = setInterval(() => {
    if (!RUNNING) return;
    if (SKIP) {
      SKIP = false;
      _stop = true;
      clearInterval(interval);
      return;
    }
    seconds--;
    displayTimer(seconds);
    if (seconds === 0) {
      _stop = true;
      clearInterval(interval);
    }
  }, 1000);

  while (true) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (_quit) return 0;
    if (_stop) break;
  }
};

function onUserInput(prompt) {
  switch (prompt) {
    case 'r':
      RUNNING = true;
      displayInstructions();
      break;
    case 's':
      SKIP = true;
      break;
    case 'p':
      RUNNING = !RUNNING;
      break;
    case 'q':
      _quit = true;
      break;
    default:
      break;
  }
}

RL.on('line', (line) => {
  onUserInput(line.trim());
  writeLine(5, '');
  RL.prompt();
});

export const exit = () => {
  RL.close();
};
