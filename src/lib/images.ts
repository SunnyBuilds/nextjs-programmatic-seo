export const IMAGE_COUNT = 50;

export function getRandomImage(keyword: string): string {
  const normalizedKeyword = keyword.toLowerCase();
  let category = 'default';

  if (normalizedKeyword.includes('sushi')) {
    category = 'sushi';
  } else if (normalizedKeyword.includes('pizza')) {
    category = 'pizza';
  } else if (normalizedKeyword.includes('steak')) {
    category = 'steakhouse';
  } else if (normalizedKeyword.includes('plumber') || normalizedKeyword.includes('plumbing')) {
    category = 'plumber';
  }

  const randomNumber = Math.floor(Math.random() * IMAGE_COUNT) + 1;
  return `/images/${category}/${randomNumber}.webp`;
}
