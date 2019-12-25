/*
https://adventofcode.com/2019/day/9
--- Day 9: Sensor Boost ---
You've just said goodbye to the rebooted rover and left Mars when you receive a faint distress signal coming from the asteroid belt. It must be the Ceres monitoring station!

In order to lock on to the signal, you'll need to boost your sensors. The Elves send up the latest BOOST program - Basic Operation Of System Test.

While BOOST (your puzzle input) is capable of boosting your sensors, for tenuous safety reasons, it refuses to do so until the computer it runs on passes some checks to demonstrate it is a complete Intcode computer.

Your existing Intcode computer is missing one key feature: it needs support for parameters in relative mode.

Parameters in mode 2, relative mode, behave very similarly to parameters in position mode: the parameter is interpreted as a position. Like position mode, parameters in relative mode can be read from or written to.

The important difference is that relative mode parameters don't count from address 0. Instead, they count from a value called the relative base. The relative base starts at 0.

The address a relative mode parameter refers to is itself plus the current relative base. When the relative base is 0, relative mode parameters and position mode parameters with the same value refer to the same address.

For example, given a relative base of 50, a relative mode parameter of -7 refers to memory address 50 + -7 = 43.

The relative base is modified with the relative base offset instruction:

Opcode 9 adjusts the relative base by the value of its only parameter. The relative base increases (or decreases, if the value is negative) by the value of the parameter.
For example, if the relative base is 2000, then after the instruction 109,19, the relative base would be 2019. If the next instruction were 204,-34, then the value at address 1985 would be output.

Your Intcode computer will also need a few other capabilities:

The computer's available memory should be much larger than the initial program. Memory beyond the initial program starts with the value 0 and can be read or written like any other memory. (It is invalid to try to access memory at a negative address, though.)
The computer should have support for large numbers. Some instructions near the beginning of the BOOST program will verify this capability.
Here are some example programs that use these features:

109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99 takes no input and produces a copy of itself as output.
1102,34915192,34915192,7,4,7,99,0 should output a 16-digit number.
104,1125899906842624,99 should output the large number in the middle.
The BOOST program will ask for a single input; run it in test mode by providing it the value 1. It will perform a series of checks on each opcode, output any opcodes (and the associated parameter modes) that seem to be functioning incorrectly, and finally output a BOOST keycode.

Once your Intcode computer is fully functional, the BOOST program should report no malfunctioning opcodes when run in test mode; it should only output a single value, the BOOST keycode. What BOOST keycode does it produce?
*/

function run(original, inputValue) {
  let program = Array.from(original);
  let relativeBase = 0;
  let pc = 0;
  let output = [];
  function getAddr(paramMode, memValue) {
    let result = memValue; // assume position mode
    if (paramMode === '2') { // relative mode
      result += relativeBase;
    }
    return result;
  }
  function getParamValue(paramMode, memValue) {
    if (paramMode === '1') { // immediate mode
        return memValue;
    }
    let result = program[getAddr(paramMode, memValue)];
    if (result === undefined) {
      // allow out of bounds access
      return 0;
    }
    return result;
  }
  while (true) {
    let opcode = program[pc] % 100;
    if (opcode === 99) {
      return output;
    }
    let s = `${program[pc]}`.padStart(5, '0');
    let paramMode1 = s[2];
    let paramMode2 = s[1];
    let paramMode3 = s[0];
    let param1 = getParamValue(paramMode1, program[pc+1]);
    if (opcode === 1) { // add p3 = p1 + p2
      let param2 = getParamValue(paramMode2, program[pc+2]);
      let addr3 = getAddr(paramMode3, program[pc+3]);
      program[addr3] = param1 + param2;
      pc += 4;
    } else if (opcode === 2) { // mul p3 = p1 * p2
      let param2 = getParamValue(paramMode2, program[pc+2]);
      let addr3 = getAddr(paramMode3, program[pc+3]);
      program[addr3] = param1 * param2;
      pc += 4;
    } else if (opcode === 3) { // p1 = input
      let addr1 = getAddr(paramMode1, program[pc+1]);
      program[addr1] = inputValue;
      pc += 2;
    } else if (opcode === 4) { // output p1
      output.push(param1);
      console.log(param1);
      pc += 2;
    } else if (opcode === 5) { // jump if true; if p1 then pc = p2
      if (param1 !== 0) {
        pc = getParamValue(paramMode2, program[pc+2]);
      } else {
        pc += 3;
      }
    } else if (opcode === 6) { // jump if false; if p1==0 then pc = p2
      if (param1 === 0) {
        pc = getParamValue(paramMode2, program[pc+2]);
      } else {
        pc += 3;
      }
    } else if (opcode === 7) { // less p3 = (p1 < p2) ? 1 : 0
      let param2 = getParamValue(paramMode2, program[pc+2]);
      let addr3 = getAddr(paramMode3, program[pc+3]);
      program[addr3] = (param1 < param2) ? 1 : 0;
      pc += 4;
    } else if (opcode === 8) { // eq p3 = (p1 == p2) ? 1 : 0
      let param2 = getParamValue(paramMode2, program[pc+2]);
      let addr3 = getAddr(paramMode3, program[pc+3]);
      program[addr3] = (param1 === param2) ? 1 : 0;
      pc += 4;
    } else if (opcode === 9) { // adjust relative base offset
      relativeBase += param1;
      pc += 2;
    } else {
      return "illegal instruction " + opcode + " at pc " + pc + "\n" + program;
    }
  }
}

var quine = [109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99];
console.assert(run(quine).toString() === quine.toString(), 'quine');
console.assert(run([1102,34915192,34915192,7,4,7,99,0]).toString().length === 16, '16 digit number');
console.assert([1125899906842624].toString() === run([104,1125899906842624,99]).toString(), 'big number identity');

var day09input = [
1102,34463338,34463338,63,1007,63,34463338,63,1005,63,53,1101,0,3,1000,109,988,209,12,9,1000,209,6,209,3,203,0,1008,1000,1,63,1005,63,65,1008,1000,2,63,1005,63,904,1008,1000,0,63,1005,63,58,4,25,104,0,99,4,0,104,0,99,4,17,104,0,99,0,0,1101,0,252,1023,1101,0,0,1020,1102,1,39,1013,1102,1,234,1029,1102,26,1,1016,1101,37,0,1005,1101,0,27,1011,1101,21,0,1000,1101,0,29,1019,1101,35,0,1003,1102,22,1,1007,1102,1,32,1001,1101,1,0,1021,1102,1,216,1027,1102,30,1,1012,1102,1,24,1009,1101,36,0,1002,1101,0,31,1010,1101,0,243,1028,1102,787,1,1024,1102,255,1,1022,1102,33,1,1017,1102,1,23,1004,1102,778,1,1025,1102,1,28,1008,1101,0,223,1026,1102,1,25,1015,1101,0,20,1006,1102,34,1,1014,1101,38,0,1018,109,-4,1202,5,1,63,1008,63,32,63,1005,63,203,4,187,1106,0,207,1001,64,1,64,1002,64,2,64,109,37,2106,0,-6,1001,64,1,64,1106,0,225,4,213,1002,64,2,64,109,3,2106,0,-8,4,231,1001,64,1,64,1105,1,243,1002,64,2,64,109,-12,2105,1,-1,1105,1,261,4,249,1001,64,1,64,1002,64,2,64,109,-13,2102,1,-3,63,1008,63,31,63,1005,63,285,1001,64,1,64,1106,0,287,4,267,1002,64,2,64,109,6,21102,40,1,0,1008,1017,40,63,1005,63,313,4,293,1001,64,1,64,1105,1,313,1002,64,2,64,109,-10,2107,31,-6,63,1005,63,331,4,319,1105,1,335,1001,64,1,64,1002,64,2,64,109,-6,2102,1,7,63,1008,63,28,63,1005,63,357,4,341,1105,1,361,1001,64,1,64,1002,64,2,64,109,2,21107,41,40,8,1005,1011,377,1106,0,383,4,367,1001,64,1,64,1002,64,2,64,109,-1,1201,2,0,63,1008,63,26,63,1005,63,403,1106,0,409,4,389,1001,64,1,64,1002,64,2,64,109,22,1205,-4,425,1001,64,1,64,1105,1,427,4,415,1002,64,2,64,109,-9,21101,42,0,3,1008,1018,39,63,1005,63,451,1001,64,1,64,1105,1,453,4,433,1002,64,2,64,109,3,21107,43,44,0,1005,1018,475,4,459,1001,64,1,64,1105,1,475,1002,64,2,64,109,-7,21101,44,0,0,1008,1011,44,63,1005,63,497,4,481,1105,1,501,1001,64,1,64,1002,64,2,64,109,17,1206,-7,513,1105,1,519,4,507,1001,64,1,64,1002,64,2,64,109,-24,1207,5,25,63,1005,63,537,4,525,1105,1,541,1001,64,1,64,1002,64,2,64,109,7,21108,45,43,2,1005,1013,557,1106,0,563,4,547,1001,64,1,64,1002,64,2,64,109,-5,1207,-3,34,63,1005,63,583,1001,64,1,64,1106,0,585,4,569,1002,64,2,64,109,5,21108,46,46,5,1005,1016,607,4,591,1001,64,1,64,1105,1,607,1002,64,2,64,109,-12,2108,20,8,63,1005,63,627,1001,64,1,64,1105,1,629,4,613,1002,64,2,64,109,24,1206,-3,647,4,635,1001,64,1,64,1105,1,647,1002,64,2,64,109,-30,2108,32,8,63,1005,63,665,4,653,1106,0,669,1001,64,1,64,1002,64,2,64,109,22,1208,-9,20,63,1005,63,691,4,675,1001,64,1,64,1106,0,691,1002,64,2,64,109,-4,21102,47,1,3,1008,1014,49,63,1005,63,715,1001,64,1,64,1105,1,717,4,697,1002,64,2,64,109,-10,2101,0,1,63,1008,63,36,63,1005,63,743,4,723,1001,64,1,64,1105,1,743,1002,64,2,64,109,16,1201,-9,0,63,1008,63,28,63,1005,63,769,4,749,1001,64,1,64,1105,1,769,1002,64,2,64,109,2,2105,1,5,4,775,1001,64,1,64,1106,0,787,1002,64,2,64,109,-5,1202,-6,1,63,1008,63,26,63,1005,63,807,1106,0,813,4,793,1001,64,1,64,1002,64,2,64,109,-16,2107,37,4,63,1005,63,833,1001,64,1,64,1105,1,835,4,819,1002,64,2,64,109,2,2101,0,1,63,1008,63,34,63,1005,63,855,1105,1,861,4,841,1001,64,1,64,1002,64,2,64,109,19,1205,2,875,4,867,1105,1,879,1001,64,1,64,1002,64,2,64,109,-2,1208,-8,23,63,1005,63,899,1001,64,1,64,1106,0,901,4,885,4,64,99,21101,0,27,1,21102,915,1,0,1106,0,922,21201,1,61455,1,204,1,99,109,3,1207,-2,3,63,1005,63,964,21201,-2,-1,1,21102,942,1,0,1105,1,922,22102,1,1,-1,21201,-2,-3,1,21102,1,957,0,1105,1,922,22201,1,-1,-2,1106,0,968,22101,0,-2,-2,109,-3,2105,1,0
];
console.log(run(day09input, 1));
