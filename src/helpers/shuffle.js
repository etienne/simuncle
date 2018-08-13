// Taken from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
export default function shuffle(array) {
  const shuffledArray = array;
  for (let i = shuffledArray.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return array;
}
