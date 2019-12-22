/*
https://adventofcode.com/2019/day/22
--- Day 22: Slam Shuffle ---
There isn't much to do while you wait for the droids to repair your ship. At least you're drifting in the right direction. You decide to practice a new card shuffle you've been working on.

Digging through the ship's storage, you find a deck of space cards! Just like any deck of space cards, there are 10007 cards in the deck numbered 0 through 10006. The deck must be new - they're still in factory order, with 0 on the top, then 1, then 2, and so on, all the way through to 10006 on the bottom.

You've been practicing three different techniques that you use while shuffling. Suppose you have a deck of only 10 cards (numbered 0 through 9):

To deal into new stack, create a new stack of cards by dealing the top card of the deck onto the top of the new stack repeatedly until you run out of cards:

Top          Bottom
0 1 2 3 4 5 6 7 8 9   Your deck
                      New stack

  1 2 3 4 5 6 7 8 9   Your deck
                  0   New stack

    2 3 4 5 6 7 8 9   Your deck
                1 0   New stack

      3 4 5 6 7 8 9   Your deck
              2 1 0   New stack

Several steps later...

                  9   Your deck
  8 7 6 5 4 3 2 1 0   New stack

                      Your deck
9 8 7 6 5 4 3 2 1 0   New stack
Finally, pick up the new stack you've just created and use it as the deck for the next technique.

To cut N cards, take the top N cards off the top of the deck and move them as a single unit to the bottom of the deck, retaining their order. For example, to cut 3:

Top          Bottom
0 1 2 3 4 5 6 7 8 9   Your deck

      3 4 5 6 7 8 9   Your deck
0 1 2                 Cut cards

3 4 5 6 7 8 9         Your deck
              0 1 2   Cut cards

3 4 5 6 7 8 9 0 1 2   Your deck
You've also been getting pretty good at a version of this technique where N is negative! In that case, cut (the absolute value of) N cards from the bottom of the deck onto the top. For example, to cut -4:

Top          Bottom
0 1 2 3 4 5 6 7 8 9   Your deck

0 1 2 3 4 5           Your deck
            6 7 8 9   Cut cards

        0 1 2 3 4 5   Your deck
6 7 8 9               Cut cards

6 7 8 9 0 1 2 3 4 5   Your deck
To deal with increment N, start by clearing enough space on your table to lay out all of the cards individually in a long line. Deal the top card into the leftmost position. Then, move N positions to the right and deal the next card there. If you would move into a position past the end of the space on your table, wrap around and keep counting from the leftmost card again. Continue this process until you run out of cards.

For example, to deal with increment 3:


0 1 2 3 4 5 6 7 8 9   Your deck
. . . . . . . . . .   Space on table
^                     Current position

Deal the top card to the current position:

  1 2 3 4 5 6 7 8 9   Your deck
0 . . . . . . . . .   Space on table
^                     Current position

Move the current position right 3:

  1 2 3 4 5 6 7 8 9   Your deck
0 . . . . . . . . .   Space on table
      ^               Current position

Deal the top card:

    2 3 4 5 6 7 8 9   Your deck
0 . . 1 . . . . . .   Space on table
      ^               Current position

Move right 3 and deal:

      3 4 5 6 7 8 9   Your deck
0 . . 1 . . 2 . . .   Space on table
            ^         Current position

Move right 3 and deal:

        4 5 6 7 8 9   Your deck
0 . . 1 . . 2 . . 3   Space on table
                  ^   Current position

Move right 3, wrapping around, and deal:

          5 6 7 8 9   Your deck
0 . 4 1 . . 2 . . 3   Space on table
    ^                 Current position

And so on:

0 7 4 1 8 5 2 9 6 3   Space on table
Positions on the table which already contain cards are still counted; they're not skipped. Of course, this technique is carefully designed so it will never put two cards in the same position or leave a position empty.

Finally, collect the cards on the table so that the leftmost card ends up at the top of your deck, the card to its right ends up just below the top card, and so on, until the rightmost card ends up at the bottom of the deck.

The complete shuffle process (your puzzle input) consists of applying many of these techniques. Here are some examples that combine techniques; they all start with a factory order deck of 10 cards:

deal with increment 7
deal into new stack
deal into new stack
Result: 0 3 6 9 2 5 8 1 4 7
cut 6
deal with increment 7
deal into new stack
Result: 3 0 7 4 1 8 5 2 9 6
deal with increment 7
deal with increment 9
cut -2
Result: 6 3 0 7 4 1 8 5 2 9
deal into new stack
cut -2
deal with increment 7
cut 8
cut -4
deal with increment 7
cut 3
deal with increment 9
deal with increment 3
cut -1
Result: 9 2 5 8 1 4 7 0 3 6
Positions within the deck count from 0 at the top, then 1 for the card immediately below the top card, and so on to the bottom. (That is, cards start in the position matching their number.)

After shuffling your factory order deck of 10007 cards, what is the position of card 2019?
*/

function newDeck(cards) {
  let result = [];
  for (var i = 0; i < cards; i++) {
    result.push(i);
  }
  return result;
}

function cut(deck, i) {
  return deck.slice(i).concat(deck.slice(0, i));    
}

console.assert(cut(newDeck(10), 3).join(' ') === '3 4 5 6 7 8 9 0 1 2');
console.assert(cut(newDeck(10), -4).join(' ') === '6 7 8 9 0 1 2 3 4 5');

function deal(deck, increment) {
  let result = [];
  deck.forEach(function(v, index) {
    result[(index * increment) % deck.length] = v;
  });
  return result;
}
console.assert(deal(newDeck(10), 3).join(' ') === '0 7 4 1 8 5 2 9 6 3');

function shuffle(deck, instructions) {
  let result = deck;
  for (let instruction of instructions) {
    if (instruction === "deal into new stack") {
      result = result.reverse();
    } else if (instruction.startsWith("cut")) {
      result = cut(result, Number.parseInt(instruction.slice(4)));
    } else if (instruction.startsWith("deal with increment")) {
      result = deal(result, Number.parseInt(instruction.slice(20)));
    } else {
      console.log("Unknown instruction: " + instruction);
    }
  }
  return result;
}

console.assert(shuffle(newDeck(3), ['deal into new stack']).join(' ') === '2 1 0');
console.assert(shuffle(newDeck(10), [
  'deal with increment 7',
  'deal into new stack',
  'deal into new stack']).join(' ') === '0 3 6 9 2 5 8 1 4 7');
console.assert(shuffle(newDeck(10), [
  'cut 6',
  'deal with increment 7',
  'deal into new stack']).join(' ') === '3 0 7 4 1 8 5 2 9 6');
console.assert(shuffle(newDeck(10), [
  'deal with increment 7',
  'deal with increment 9',
  'cut -2']).join(' ') === '6 3 0 7 4 1 8 5 2 9');
console.assert(shuffle(newDeck(10), [
  'deal into new stack',
  'cut -2',
  'deal with increment 7',
  'cut 8',
  'cut -4',
  'deal with increment 7',
  'cut 3',
  'deal with increment 9',
  'deal with increment 3',
  'cut -1']).join(' ') === '9 2 5 8 1 4 7 0 3 6');
function is2019(x) {
  return x === 2019;
}

let day22input = [
"cut -1468",
"deal with increment 19",
"cut -7127",
"deal with increment 8",
"cut -8697",
"deal with increment 58",
"cut 4769",
"deal into new stack",
"cut 4921",
"deal with increment 16",
"cut -1538",
"deal with increment 55",
"cut 3387",
"deal with increment 41",
"cut 4127",
"deal with increment 26",
"cut 5512",
"deal with increment 21",
"deal into new stack",
"deal with increment 44",
"cut -7989",
"deal with increment 28",
"cut 569",
"deal into new stack",
"cut -9795",
"deal into new stack",
"cut -6877",
"deal with increment 60",
"cut -6500",
"deal with increment 37",
"cut -9849",
"deal with increment 66",
"cut -4821",
"deal with increment 50",
"deal into new stack",
"cut 9645",
"deal with increment 22",
"cut -6430",
"deal with increment 17",
"cut 658",
"deal with increment 67",
"cut -9951",
"deal into new stack",
"deal with increment 31",
"cut -2423",
"deal with increment 39",
"cut -5126",
"deal with increment 7",
"cut 432",
"deal with increment 8",
"cut 682",
"deal with increment 45",
"deal into new stack",
"deal with increment 41",
"cut -130",
"deal with increment 74",
"deal into new stack",
"cut -9207",
"deal into new stack",
"cut 7434",
"deal with increment 31",
"cut -5165",
"deal into new stack",
"cut 6209",
"deal with increment 25",
"cut 2734",
"deal with increment 53",
"deal into new stack",
"cut -1528",
"deal with increment 25",
"deal into new stack",
"deal with increment 68",
"cut 6458",
"deal into new stack",
"cut 1895",
"deal with increment 16",
"cut -6137",
"deal with increment 53",
"cut 2761",
"deal with increment 73",
"deal into new stack",
"cut 1217",
"deal with increment 69",
"deal into new stack",
"deal with increment 54",
"cut -6639",
"deal into new stack",
"cut -2891",
"deal with increment 10",
"cut -6297",
"deal with increment 31",
"cut 4591",
"deal with increment 35",
"cut -4035",
"deal with increment 65",
"cut -7504",
"deal into new stack",
"deal with increment 54",
"deal into new stack",
"cut 1313",
];

console.log(shuffle(newDeck(10007), day22input).findIndex(is2019));
