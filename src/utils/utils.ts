export function msToString(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60); 
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function getRandomNumbersInRange(
  min: number, 
  max: number, 
  n: number
) {
  if (n > max - min + 1) {
      throw new Error("wrong parameters");
  }

  const numbers = new Set<number>();
  while (numbers.size < n) {
      const num = Math.floor(Math.random() * (max - min + 1)) + min;
      numbers.add(num);
  }

  return Array.from(numbers);
}