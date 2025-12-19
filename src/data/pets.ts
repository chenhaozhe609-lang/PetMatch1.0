import { Pet } from '@/types/pet';

export const pets: Pet[] = [
  // Dogs
  {
    id: 'dog_golden',
    name: 'Golden Retriever',
    category: 'Dog',
    size: 'large',
    energy: 'high',
    coat: 'long',
    maintenance: 'high',
    description: 'Friendly, intelligent, and devoted. Loves outdoor activities.',
  },
  {
    id: 'dog_pug',
    name: 'Pug',
    category: 'Dog',
    size: 'small',
    energy: 'low',
    coat: 'short',
    maintenance: 'medium',
    description: 'Charming, mischievous, and loving. Great for apartments.',
  },
  {
    id: 'dog_mixed',
    name: 'Mixed Breed / Rescue',
    category: 'Dog',
    size: 'medium', // Varies, but medium is a safe default
    energy: 'medium',
    coat: 'short',
    maintenance: 'low', // Generally hardier
    description: 'Unique and full of love. Adopting saves a life!',
  },
  {
    id: 'dog_greyhound',
    name: 'Greyhound',
    category: 'Dog',
    size: 'large',
    energy: 'medium', // Surprisingly lazy indoors
    coat: 'short',
    maintenance: 'low',
    description: 'Gentle and quiet. A 45mph couch potato.',
  },

  // Cats
  {
    id: 'cat_persian',
    name: 'Persian',
    category: 'Cat',
    size: 'medium',
    energy: 'low',
    coat: 'long',
    maintenance: 'high',
    description: 'Sweet, gentle, and prefers a calm atmosphere. Requires daily grooming.',
  },
  {
    id: 'cat_siamese',
    name: 'Siamese',
    category: 'Cat',
    size: 'medium',
    energy: 'high',
    coat: 'short',
    maintenance: 'medium',
    description: 'Vocal, social, and intelligent. Loves to be part of the action.',
  },
  {
    id: 'cat_sphynx',
    name: 'Sphynx',
    category: 'Cat',
    size: 'medium',
    energy: 'high',
    coat: 'hairless',
    maintenance: 'high', // Skin care needed
    description: 'Hairless, warm, and affectionate. Great for fur allergies.',
  },
  {
    id: 'cat_shorthair',
    name: 'Domestic Shorthair',
    category: 'Cat',
    size: 'medium',
    energy: 'medium',
    coat: 'short',
    maintenance: 'low',
    description: 'The standard house cat. Low maintenance and independent.',
  },

  // Small Pets / Reptiles
  {
    id: 'reptile_bearded_dragon',
    name: 'Bearded Dragon',
    category: 'Reptile',
    size: 'medium',
    energy: 'medium',
    coat: 'none',
    maintenance: 'medium',
    diet: 'insectivore', // Needs bugs
    description: 'Friendly reptile that tolerates handling well.',
  },
  {
    id: 'reptile_leopard_gecko',
    name: 'Leopard Gecko',
    category: 'Reptile',
    size: 'small',
    energy: 'low',
    coat: 'none',
    maintenance: 'low',
    diet: 'insectivore', // Needs bugs
    description: 'Cute, hardy, and comes in many patterns.',
  },
  {
    id: 'reptile_crestie',
    name: 'Crested Gecko',
    category: 'Reptile',
    size: 'small',
    energy: 'medium',
    coat: 'none',
    maintenance: 'low',
    diet: 'omnivore', // Powder mix mostly
    description: 'Easy to care for, arboreal gecko. Can eat fruit mix.',
  },
  {
    id: 'small_hamster',
    name: 'Hamster',
    category: 'Small Pet',
    size: 'small',
    energy: 'high', // at night
    coat: 'short',
    maintenance: 'medium',
    diet: 'herbivore', // mostly seeds/veg
    description: 'Solitary and cute. Active at night.',
  },
];
