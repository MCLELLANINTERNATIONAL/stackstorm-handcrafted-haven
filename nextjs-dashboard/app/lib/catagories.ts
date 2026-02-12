export type Category = {
    slug: 'wood' | 'home' | 'crochet-knitted' | 'christmas' | 'art';
    label: string;
    imagePath?: string; // optional if you want images on the cards
  };
  
  export const CATEGORIES: Category[] = [
    { slug: 'wood', label: 'Wood', imagePath: '/categories/wood.jpg' },
    { slug: 'home', label: 'Home', imagePath: '/categories/home.jpg' },
    { slug: 'crochet-knitted', label: 'Crochet & Knitted', imagePath: '/categories/crochet-knitted.jpg' },
    { slug: 'christmas', label: 'Christmas', imagePath: '/categories/christmas.jpg' },
    { slug: 'art', label: 'Art', imagePath: '/categories/art.jpg' },
  ];
  