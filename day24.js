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
