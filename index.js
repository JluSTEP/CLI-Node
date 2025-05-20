#!/usr/bin/env node

const fs = require('fs');
const { pipeline } = require('stream');
const { program } = require('commander');
const shiftedDiff = require('./shiftedDiff');
const readline = require('readline');

program
  .requiredOption('-t, --task <task>', 'Task to execute')
  .option('-i, --input <inputFile>', 'Input file path')
  .option('-o, --output <outputFile>', 'Output file path');

program.parse(process.argv);
const options = program.opts();

if (options.task !== 'shiftedDiff') {
  console.error('Unsupported task.');
  process.exit(1);
}

function processInput(data, writeOutput) {
  const [first, second] = data.trim().split(':');
  if (!first || !second) {
    writeOutput('Invalid input format. Use "string1:string2"\n');
    return;
  }
  const result = shiftedDiff(first, second);
  writeOutput(result + '\n');
}

const writeOutput = (text) => {
  if (options.output) {
    fs.writeFileSync(options.output, text);
  } else {
    process.stdout.write(text);
  }
};

if (options.input) {
  fs.readFile(options.input, 'utf-8', (err, data) => {
    if (err) {
      console.error('Error reading input file:', err.message);
      process.exit(1);
    }
    processInput(data, writeOutput);
  });
} else {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  rl.setPrompt('Введите строку в формате string1:string2:\n');
  rl.prompt();

  rl.on('line', (line) => {
    if (line.trim() === '') {
        console.log('Завершение программы.');
        rl.close();
        return;
    }
    processInput(line, writeOutput);
    rl.prompt();
  });
}
