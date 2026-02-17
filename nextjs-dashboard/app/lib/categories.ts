export type CategorySlug =
  | 'wood'
  | 'home'
  | 'art'
  | 'christmas'
  | 'crochet-knitted';

export type CatalogCategorySlug = CategorySlug | 'all-products';

export type Category = {
  slug: CatalogCategorySlug;
  label: string;
  imagePath: string;
  description: string;
};

export const CATEGORIES: readonly Category[] = [
  {
    slug: 'christmas',
    label: 'Christmas',
    imagePath: '/products/christmas/c15.png',
    description:
      'Uniquely crafted Christmas items for the festive season.',
  },
  {
    slug: 'crochet-knitted',
    label: 'Crochet & Knitted',
    imagePath: '/products/crochet_knitted/ck2.png',
    description:
      'Beautiful crochet and knitted items for you, family, and friends.',
  },
  {
    slug: 'home',
    label: 'Home',
    imagePath: '/products/home/ls11.png',
    description: 'Handmade home pieces to warm your space.',
  },
  {
    slug: 'art',
    label: 'Art',
    imagePath: '/products/arts/a1.png',
    description:
      'Inspired art celebrating the beauty of creation.',
  },
  {
    slug: 'wood',
    label: 'Wood',
    imagePath: '/products/wood/w4.png',
    description:
      'Handcrafted wood pieces for home and office.',
  },
  {
    slug: 'all-products',
    label: 'All Products',
    imagePath: '/products/all/hero-desktop.png',
    description: 'Browse all handcrafted products in one place.',
  },
] as const;