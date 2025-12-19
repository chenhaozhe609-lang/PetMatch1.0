export interface UserConstraints {
  space?: 'apartment' | 'house_small' | 'house_large';
  time?: 'low' | 'medium' | 'high';
  budget?: 'low' | 'medium' | 'high';
  dealBreaker?: 'fur' | 'bugs/mice' | 'noise' | 'none';
}

export interface Pet {
  id: string;
  name: string; // e.g., "Golden Retriever"
  category: 'Dog' | 'Cat' | 'Small Pet' | 'Reptile' | 'Bird';
  size: 'small' | 'medium' | 'large';
  energy: 'low' | 'medium' | 'high';
  coat: 'hairless' | 'short' | 'long' | 'none'; // none for reptiles
  maintenance: 'low' | 'medium' | 'high';
  diet?: 'carnivore' | 'herbivore' | 'omnivore' | 'insectivore';
  isCompromise?: boolean; // Flag for fallback logic
  description: string;
}
