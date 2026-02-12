export type CategorySlug =
  | 'wood'
  | 'home'
  | 'art'
  | 'christmas'
  | 'crochet-knitted';

export type Category = {
  slug: CategorySlug;
  label: string;
  imagePath?: string;
};

export const CATEGORIES: readonly Category[] = [
  { slug: 'wood', label: 'Wood', imagePath: '/categories/wood.jpg' },
  { slug: 'home', label: 'Home', imagePath: '/categories/home.jpg' },
  { slug: 'art', label: 'Art', imagePath: '/categories/art.jpg' },
  { slug: 'christmas', label: 'Christmas', imagePath: '/categories/christmas.jpg' },
  {
    slug: 'crochet-knitted',
    label: 'Crochet & Knitted',
    imagePath: '/categories/crochet-knitted.jpg',
  },
] as const;
