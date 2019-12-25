/*
https://adventofcode.com/2019/day/24
--- Day 24: Planet of Discord ---
You land on Eris, your last stop before reaching Santa. As soon as you do, your sensors start picking up strange life forms moving around: Eris is infested with bugs! With an over 24-hour roundtrip for messages between you and Earth, you'll have to deal with this problem on your own.

Eris isn't a very large place; a scan of the entire area fits into a 5x5 grid (your puzzle input). The scan shows bugs (#) and empty spaces (.).

Each minute, The bugs live and die based on the number of bugs in the four adjacent tiles:

A bug dies (becoming an empty space) unless there is exactly one bug adjacent to it.
An empty space becomes infested with a bug if exactly one or two bugs are adjacent to it.
Otherwise, a bug or empty space remains the same. (Tiles on the edges of the grid have fewer than four adjacent tiles; the missing tiles count as empty space.) This process happens in every location simultaneously; that is, within the same minute, the number of adjacent bugs is counted for every tile first, and then the tiles are updated.

Here are the first few minutes of an example scenario:

Initial state:
....#
#..#.
#..##
..#..
#....

After 1 minute:
#..#.
####.
###.#
##.##
.##..

After 2 minutes:
#####
....#
....#
...#.
#.###

After 3 minutes:
#....
####.
...##
#.##.
.##.#

After 4 minutes:
####.
....#
##..#
.....
##...
To understand the nature of the bugs, watch for the first time a layout of bugs and empty spaces matches any previous layout. In the example above, the first layout to appear twice is:

.....
.....
.....
#....
.#...
To calculate the biodiversity rating for this layout, consider each tile left-to-right in the top row, then left-to-right in the second row, and so on. Each of these tiles is worth biodiversity points equal to increasing powers of two: 1, 2, 4, 8, 16, 32, and so on. Add up the biodiversity points for tiles with bugs; in this example, the 16th tile (32768 points) and 22nd tile (2097152 points) have bugs, a total biodiversity rating of 2129920.

What is the biodiversity rating for the first layout that appears twice?
*/

function getRating(grid) {
  let binary = grid.join('').replace(/\./g,0).replace(/#/g,1);
  return Number.parseInt(Array.from(binary).reverse().join(''), 2);
}

console.assert(getRating([
'.....',
'.....',
'.....',
'#....',
'.#...']) === 2129920);

function step(grid) {
  var result = [];
  for (let y = 0; y < 5; y++) {
    let row = [];
    for (let x = 0; x < 5; x++) {
      let n = neighbors(grid, x, y);
      row[x] = (grid[y][x] === '#')
        ? (n === 1 ? '#' : '.')
        : ((n === 1 || n === 2) ? '#' : '.');
    }
    result.push(row.join(''));
  }
  return result;
}

function neighbors(grid, x, y) {
  var up = (y > 0) && (grid[y-1][x] === '#') & 1;
  var lt = (x > 0) && (grid[y][x-1] === '#') & 1;
  var rt = (x < 4) && (grid[y][x+1] === '#') & 1;
  var dn = (y < 4) && (grid[y+1][x] === '#') & 1;
  return up + lt + rt + dn;
}

var example0 = [
'....#',
'#..#.',
'#..##',
'..#..',
'#....'];

var example1 = [
'#..#.',
'####.',
'###.#',
'##.##',
'.##..'];

var example2 = [
'#####',
'....#',
'....#',
'...#.',
'#.###'];

var example3 = [
'#....',
'####.',
'...##',
'#.##.',
'.##.#'];

var example4 = [
'####.',
'....#',
'##..#',
'.....',
'##...'];

console.assert(step(example0).join() === example1.join());
console.assert(step(example1).join() === example2.join());
console.assert(step(example2).join() === example3.join());
console.assert(step(example3).join() === example4.join());

var day24input = [
'##...',
'#.###',
'.#.#.',
'#....',
'..###'];

function findDuplicate(grid) {
  var seen = new Set();
  var i = 0;
  var eris = grid;
  var rating = getRating(eris);
  while (!seen.has(rating)) {
    seen.add(rating);
    eris = step(eris);
    rating = getRating(eris);
    if (++i % 1000 === 0) {
      console.log(i + '\t' + eris.join());
    }
  }
  return eris;
}
console.log(getRating(findDuplicate(day24input)));

/*
Part Two ---
After careful analysis, one thing is certain: you have no idea where all these bugs are coming from.

Then, you remember: Eris is an old Plutonian settlement! Clearly, the bugs are coming from recursively-folded space.

This 5x5 grid is only one level in an infinite number of recursion levels. The tile in the middle of the grid is actually another 5x5 grid, the grid in your scan is contained as the middle tile of a larger 5x5 grid, and so on. Two levels of grids look like this:

     |     |         |     |     
     |     |         |     |     
     |     |         |     |     
-----+-----+---------+-----+-----
     |     |         |     |     
     |     |         |     |     
     |     |         |     |     
-----+-----+---------+-----+-----
     |     | | | | | |     |     
     |     |-+-+-+-+-|     |     
     |     | | | | | |     |     
     |     |-+-+-+-+-|     |     
     |     | | |?| | |     |     
     |     |-+-+-+-+-|     |     
     |     | | | | | |     |     
     |     |-+-+-+-+-|     |     
     |     | | | | | |     |     
-----+-----+---------+-----+-----
     |     |         |     |     
     |     |         |     |     
     |     |         |     |     
-----+-----+---------+-----+-----
     |     |         |     |     
     |     |         |     |     
     |     |         |     |     
(To save space, some of the tiles are not drawn to scale.) Remember, this is only a small part of the infinitely recursive grid; there is a 5x5 grid that contains this diagram, and a 5x5 grid that contains that one, and so on. Also, the ? in the diagram contains another 5x5 grid, which itself contains another 5x5 grid, and so on.

The scan you took (your puzzle input) shows where the bugs are on a single level of this structure. The middle tile of your scan is empty to accommodate the recursive grids within it. Initially, no other levels contain bugs.

Tiles still count as adjacent if they are directly up, down, left, or right of a given tile. Some tiles have adjacent tiles at a recursion level above or below its own level. For example:

     |     |         |     |     
  1  |  2  |    3    |  4  |  5  
     |     |         |     |     
-----+-----+---------+-----+-----
     |     |         |     |     
  6  |  7  |    8    |  9  |  10 
     |     |         |     |     
-----+-----+---------+-----+-----
     |     |A|B|C|D|E|     |     
     |     |-+-+-+-+-|     |     
     |     |F|G|H|I|J|     |     
     |     |-+-+-+-+-|     |     
 11  | 12  |K|L|?|N|O|  14 |  15 
     |     |-+-+-+-+-|     |     
     |     |P|Q|R|S|T|     |     
     |     |-+-+-+-+-|     |     
     |     |U|V|W|X|Y|     |     
-----+-----+---------+-----+-----
     |     |         |     |     
 16  | 17  |    18   |  19 |  20 
     |     |         |     |     
-----+-----+---------+-----+-----
     |     |         |     |     
 21  | 22  |    23   |  24 |  25 
     |     |         |     |     
Tile 19 has four adjacent tiles: 14, 18, 20, and 24.
Tile G has four adjacent tiles: B, F, H, and L.
Tile D has four adjacent tiles: 8, C, E, and I.
Tile E has four adjacent tiles: 8, D, 14, and J.
Tile 14 has eight adjacent tiles: 9, E, J, O, T, Y, 15, and 19.
Tile N has eight adjacent tiles: I, O, S, and five tiles within the sub-grid marked ?.
The rules about bugs living and dying are the same as before.

For example, consider the same initial state as above:

....#
#..#.
#.?##
..#..
#....
The center tile is drawn as ? to indicate the next recursive grid. Call this level 0; the grid within this one is level 1, and the grid that contains this one is level -1. Then, after ten minutes, the grid at each level would look like this:

Depth -5:
..#..
.#.#.
..?.#
.#.#.
..#..

Depth -4:
...#.
...##
..?..
...##
...#.

Depth -3:
#.#..
.#...
..?..
.#...
#.#..

Depth -2:
.#.##
....#
..?.#
...##
.###.

Depth -1:
#..##
...##
..?..
...#.
.####

Depth 0:
.#...
.#.##
.#?..
.....
.....

Depth 1:
.##..
#..##
..?.#
##.##
#####

Depth 2:
###..
##.#.
#.?..
.#.##
#.#..

Depth 3:
..###
.....
#.?..
#....
#...#

Depth 4:
.###.
#..#.
#.?..
##.#.
.....

Depth 5:
####.
#..#.
#.?#.
####.
.....
In this example, after 10 minutes, a total of 99 bugs are present.

Starting with your scan, how many bugs are present after 200 minutes?
*/

function step2(space) {
  var result = [];
  // if any inner bugs on z0, push new inner grid
  var inGrid = inStep(space[0]);
  if (countBugs(inGrid) > 0) {
    result.push(inGrid);
  }
  for (let z = 0; z < space.length; z++) {
    let grid = [];
    for (let y = 0; y < 5; y++) {
      let row = [];
      for (let x = 0; x < 5; x++) {
        if (x == 2 && y == 2) {
          row[x] = '?';
          continue;
        }
        let n = neighbors2(space, x, y, z);
        row[x] = (space[z][y][x] === '#')
          ? (n === 1 ? '#' : '.')
          : ((n === 1 || n === 2) ? '#' : '.');
      }
      grid.push(row);
    }
    result.push(grid);
  }
  // if any outer bugs on zMax, push final outer grid
  var outGrid = outStep(space[space.length-1]);
  if (countBugs(outGrid) > 0) {
    result.push(outGrid);
  }
  return result;
}

function neighbors2(space, x, y, z) {
  var up = (y > 0) && (space[z][y-1][x] === '#') & 1;
  var lt = (x > 0) && (space[z][y][x-1] === '#') & 1;
  var rt = (x < 4) && (space[z][y][x+1] === '#') & 1;
  var dn = (y < 4) && (space[z][y+1][x] === '#') & 1;
  
  var inZ = z-1;
  var inSum = 0;
  if (inZ >= 0) {
    var inUp = (y == 1 && x == 2) ? countBugs(space[inZ][0]) : 0;
    var inLt = (y == 2 && x == 1) ? countBugs(space[inZ].map(c => c[0])) : 0;
    var inRt = (y == 2 && x == 3) ? countBugs(space[inZ].map(c => c[4])) : 0;
    var inDn = (y == 3 && x == 2) ? countBugs(space[inZ][4]) : 0;
    var inSum = inUp + inLt + inRt + inDn; 
  }

  var outZ = z+1;
  var outSum = 0;
  if (outZ < space.length) {
    var outUp = (y == 0) && (space[outZ][1][2] === '#') & 1;
    var outLt = (x == 0) && (space[outZ][2][1] === '#') & 1;
    var outRt = (x == 4) && (space[outZ][2][3] === '#') & 1;
    var outDn = (y == 4) && (space[outZ][3][2] === '#') & 1;
    outSum = outUp + outLt + outRt + outDn;
  }
  
  return up + lt + rt + dn + inSum + outSum;
}

var emptyRow = ['.', '.', '.', '.', '.'];
var middleRow = ['.', '.', '?', '.', '.'];
var fullRow = ['#', '#', '#', '#', '#'];
function inStep(grid) {
  var result = [Array.from(emptyRow), Array.from(emptyRow), Array.from(middleRow), Array.from(emptyRow), Array.from(emptyRow)];
  if (grid[1][2] === '#') {
    result[0] = Array.from(fullRow);
  }
  if (grid[2][1] === '#') {
    for (var row of result) {
      row[0] = '#';
    }
  }
  if (grid[2][3] === '#') {
    for (var row of result) {
      row[4] = '#';
    }
  }
  if (grid[3][2] === '#') {
    result[4] = Array.from(fullRow);
  } 
  return result;
}

function outStep(grid) {
  var result = [Array.from(emptyRow), Array.from(emptyRow), Array.from(middleRow), Array.from(emptyRow), Array.from(emptyRow)];
  var upCount = countBugs(grid[0]);
  if (upCount == 1 || upCount == 2) {
    result[1][2] = '#';
  }
  var ltCount = countBugs(grid.map(c => c[0]));
  if (ltCount == 1 || ltCount == 2) {
    result[2][1] = '#';
  }
  var rtCount = countBugs(grid.map(c => c[4]));
  if (rtCount == 1 || rtCount == 2) {
    result[2][3] = '#';
  }
  var dnCount = countBugs(grid[4]);
  if (dnCount == 1 || dnCount == 2) {
    result[3][2] = '#';
  }
  return result;
}

function countBugs(space) {
  return space.toString().replace(/[^#]/g, '').length;
}

function run(initialSpace, minutes = 1) {
  var space = initialSpace;
  for (let i = 1; i <= minutes; i++) {
    space = step2(space);
    console.log(countBugs(space) + ' bugs after ' + i + ' minutes');
  }
  return space;
}
    
console.assert(countBugs(run([example0], 10)) === 99);
console.log(countBugs(run([day24input], 200)));

