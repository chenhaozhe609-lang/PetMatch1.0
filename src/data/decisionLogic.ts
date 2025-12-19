import { DecisionNode } from './decisionLogic';

// Full Logic Decision Tree based on the flowchart
export const decisionTree: Record<string, DecisionNode> = {
  // 1. ROOT NODE
  root: {
    id: 'root',
    question: "Are you looking for a true companion, or just something to care for?",
    options: [
      { label: "A True Companion", outcome: 'Dog' }, // Simplified: Direct Dog path per user flow, or map to 'result_dog' if needed
      { label: "Just a Pet to Watch", nextId: 'q_hair' },
    ],
  },

  // 3. BRANCH B: HAIR TOLERANCE
  q_hair: {
    id: 'q_hair',
    question: "Do you mind dealing with shedding/hair?",
    options: [
      { label: "I don't mind (The fluffier the better)", nextId: 'q_smell' },
      { label: "Yes, I mind (Very much)", nextId: 'q_legs' },
    ],
  },

  // ---------------------------------------------------------
  // SUB-BRANCH B1: DON'T MIND HAIR (The Fluffy Route)
  // ---------------------------------------------------------
  q_smell: {
    id: 'q_smell',
    question: "What is your tolerance for smells?",
    options: [
      { label: "High Tolerance", outcome: 'Ferret' },
      { label: "Can't stand it", nextId: 'q_bite_scratch' },
      { label: "A little is cool", outcome: 'Snake' }, // Note: Logic from SQL
    ],
  },

  q_bite_scratch: {
    id: 'q_bite_scratch',
    question: "Being scratched or bitten: Which would you prefer?",
    options: [
      { label: "Neither / I'm not afraid", outcome: 'Cat' },
      { label: "Bitten?", outcome: 'Rabbit' },
    ],
  },

  // ---------------------------------------------------------
  // SUB-BRANCH B2: MIND HAIR (The Clean/Scaly Route)
  // ---------------------------------------------------------
  q_legs: {
    id: 'q_legs',
    question: "How many legs do you prefer?",
    options: [
      { label: "0 Legs", nextId: 'q_dead_mice' },
      { label: "2 Legs", outcome: 'Bird' },
      { label: "4 Legs", nextId: 'q_warm_cold' },
      { label: "8 Legs (More is better)", outcome: 'Spider' },
    ],
  },

  q_dead_mice: {
    id: 'q_dead_mice',
    question: "Do you mind buying dead mice every month?",
    options: [
      { label: "Yes, I mind", outcome: 'Goldfish' },
      { label: "No / It's kinda cool", outcome: 'Snake' },
    ],
  },

  q_warm_cold: {
    id: 'q_warm_cold',
    question: "Do you prefer warm-blooded or cold-blooded?",
    options: [
      { label: "Cold as Ice (Cold-blooded)", nextId: 'q_patience' },
      { label: "Warm & Cuddly (Warm-blooded)", nextId: 'q_tail' },
    ],
  },

  q_patience: {
    id: 'q_patience',
    question: "Are you in a rush to get a pet?",
    options: [
      { label: "No rush", outcome: 'Turtle' },
      { label: "Yes, urgent!", outcome: 'Lizard' },
    ],
  },

  q_tail: {
    id: 'q_tail',
    question: "What is your tail preference?",
    options: [
      { label: "No Tail", nextId: 'q_spikes' },
      { label: "Long Tail (Furry)", outcome: 'Gerbil' },
      { label: "Super Long Cool Tail", outcome: 'Rat' },
    ],
  },

  q_spikes: {
    id: 'q_spikes',
    question: "Want some spikes with that?",
    options: [
      { label: "Sure!", outcome: 'Hedgehog' },
      { label: "No way", outcome: 'Hamster' },
    ],
  },
};
