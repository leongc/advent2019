/*
https://adventofcode.com/2019/day/7
--- Day 7: Amplification Circuit ---
Based on the navigational maps, you're going to need to send more power to your ship's thrusters to reach Santa in time. To do this, you'll need to configure a series of amplifiers already installed on the ship.

There are five amplifiers connected in series; each one receives an input signal and produces an output signal. They are connected such that the first amplifier's output leads to the second amplifier's input, the second amplifier's output leads to the third amplifier's input, and so on. The first amplifier's input value is 0, and the last amplifier's output leads to your ship's thrusters.

    O-------O  O-------O  O-------O  O-------O  O-------O
0 ->| Amp A |->| Amp B |->| Amp C |->| Amp D |->| Amp E |-> (to thrusters)
    O-------O  O-------O  O-------O  O-------O  O-------O
The Elves have sent you some Amplifier Controller Software (your puzzle input), a program that should run on your existing Intcode computer. Each amplifier will need to run a copy of the program.

When a copy of the program starts running on an amplifier, it will first use an input instruction to ask the amplifier for its current phase setting (an integer from 0 to 4). Each phase setting is used exactly once, but the Elves can't remember which amplifier needs which phase setting.

The program will then call another input instruction to get the amplifier's input signal, compute the correct output signal, and supply it back to the amplifier with an output instruction. (If the amplifier has not yet received an input signal, it waits until one arrives.)

Your job is to find the largest output signal that can be sent to the thrusters by trying every possible combination of phase settings on the amplifiers. Make sure that memory is not shared or reused between copies of the program.

For example, suppose you want to try the phase setting sequence 3,1,2,4,0, which would mean setting amplifier A to phase setting 3, amplifier B to setting 1, C to 2, D to 4, and E to 0. Then, you could determine the output signal that gets sent from amplifier E to the thrusters with the following steps:

Start the copy of the amplifier controller software that will run on amplifier A. At its first input instruction, provide it the amplifier's phase setting, 3. At its second input instruction, provide it the input signal, 0. After some calculations, it will use an output instruction to indicate the amplifier's output signal.
Start the software for amplifier B. Provide it the phase setting (1) and then whatever output signal was produced from amplifier A. It will then produce a new output signal destined for amplifier C.
Start the software for amplifier C, provide the phase setting (2) and the value from amplifier B, then collect its output signal.
Run amplifier D's software, provide the phase setting (4) and input value, and collect its output signal.
Run amplifier E's software, provide the phase setting (0) and input value, and collect its output signal.
The final output signal from amplifier E would be sent to the thrusters. However, this phase setting sequence may not have been the best one; another sequence might have sent a higher signal to the thrusters.

Here are some example programs:

Max thruster signal 43210 (from phase setting sequence 4,3,2,1,0):

3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0
Max thruster signal 54321 (from phase setting sequence 0,1,2,3,4):

3,23,3,24,1002,24,10,24,1002,23,-1,23,
101,5,23,23,1,24,23,23,4,23,99,0,0
Max thruster signal 65210 (from phase setting sequence 1,0,4,3,2):

3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,
1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0
Try every combination of phase settings on the amplifiers. What is the highest signal that can be sent to the thrusters?
*/

// assume five phases[0-4]
function amp(p, phases) {
  let signal = 0;
  for (let phase of phases) {
    signal = run(p, [phase, signal]);
  }
  return signal;
}

// inputValues are [phase[0-4], inputLevel]
function run(original, inputValues) {
  let program = Array.from(original);
  let pc = 0;
  let output = undefined;
  while (true) {
    let opcode = program[pc] % 100;
    if (opcode === 99) {
      return output;
    }
    let s = `${program[pc]}`.padStart(5, '0');
    let paramMode1 = s[2];
    let paramMode2 = s[1];
    let paramMode3 = s[0];
    var param1 = program[pc+1];
    if (paramMode1 === '0') {
      param1 = program[param1];
    }
    if (opcode === 1) { // add p3 = p1 + p2
      var param2 = program[pc+2];
      if (paramMode2 === '0') {
        param2 = program[param2];
      }
      program[program[pc+3]] = param1 + param2;
      pc += 4;
    } else if (opcode === 2) { // mul p3 = p1 * p2
      var param2 = program[pc+2];
      if (paramMode2 === '0') {
        param2 = program[param2];
      }
      program[program[pc+3]] = param1 * param2;
      pc += 4;
    } else if (opcode === 3) { // p1 = input
      program[program[pc+1]] = inputValues.shift();
      pc += 2;
    } else if (opcode === 4) { // output p1
      output = param1;
      pc += 2
    } else if (opcode === 5) { // jump if true; if p1 then pc = p2
      if (param1 !== 0) {
        var param2 = program[pc+2];
        if (paramMode2 === '0') {
          param2 = program[param2];
        }
        pc = param2;
      } else {
        pc += 3;
      }
    } else if (opcode === 6) { // jump if false; if p1==0 then pc = p2
      if (param1 === 0) {
        var param2 = program[pc+2];
        if (paramMode2 === '0') {
          param2 = program[param2];
        }
        pc = param2;
      } else {
        pc += 3;
      }
    } else if (opcode === 7) { // less p3 = (p1 < p2) ? 1 : 0
      var param2 = program[pc+2];
      if (paramMode2 === '0') {
        param2 = program[param2];
      }
      program[program[pc+3]] = (param1 < param2) ? 1 : 0;
      pc += 4;
    } else if (opcode === 8) { // eq p3 = (p1 == p2) ? 1 : 0
      var param2 = program[pc+2];
      if (paramMode2 === '0') {
        param2 = program[param2];
      }
      program[program[pc+3]] = (param1 === param2) ? 1 : 0;
      pc += 4;
    } else {
      return "illegal instruction " + opcode + " at pc " + pc + "\n" + program;
    }
  }
}

console.assert(43210 === amp([3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0], [4,3,2,1,0]));
console.assert(54321 === amp([3,23,3,24,1002,24,10,24,1002,23,-1,23,
  101,5,23,23,1,24,23,23,4,23,99,0,0], [0,1,2,3,4]));
console.assert(65210 === amp([3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,
  1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0], [1,0,4,3,2]));

function* permute(options) {
    let q = [];
    q.push([[], new Set(options)]);
    while (q.length > 0) {
        let [accumulator, choices] = q.pop();
        if (choices.size === 1) {
            let result = Array.from(accumulator);
            result.push(choices.values().next().value);
            yield result;
        } else {
            choices.forEach(choice => {
                let prefix = Array.from(accumulator);
                prefix.push(choice);
                let remainder = new Set(choices);
                remainder.delete(choice);
                q.push([prefix, remainder]);
            });
        }
    }
}

function maxAmp(p) {
  let max = Number.MIN_VALUE;
  for (let permutation of permute([0,1,2,3,4])) {
    max = Math.max(max, amp(p, permutation));
  }
  return max;
}
console.assert(43210 === maxAmp([3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0]));

var day07input = [
3,8,1001,8,10,8,105,1,0,0,21,42,67,84,109,126,207,288,369,450,99999,3,9,102,4,9,9,1001,9,4,9,102,2,9,9,101,2,9,9,4,9,99,3,9,1001,9,5,9,1002,9,5,9,1001,9,5,9,1002,9,5,9,101,5,9,9,4,9,99,3,9,101,5,9,9,1002,9,3,9,1001,9,2,9,4,9,99,3,9,1001,9,2,9,102,4,9,9,101,2,9,9,102,4,9,9,1001,9,2,9,4,9,99,3,9,102,2,9,9,101,5,9,9,1002,9,2,9,4,9,99,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,99,3,9,1001,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,99,3,9,102,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,1,9,9,4,9,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,101,1,9,9,4,9,3,9,101,2,9,9,4,9,99,3,9,1001,9,2,9,4,9,3,9,101,1,9,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,1001,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,1,9,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,99,3,9,102,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,1,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,2,9,4,9,99
];
console.log(maxAmp(day07input));
