export interface Question {
  id: string;
  trait: string;
  question: string;
  options: {
    text: string;
    value: number | string;
  }[];
}

export const personalityQuestions: Question[] = [
  {
    id: 'q1_openness',
    trait: 'Openness',
    question: 'You won a free flight ticket to a mystery destination. Your immediate reaction?',
    options: [
      {
        text: "Pack my bags! I hope it's somewhere wild and unknown.",
        value: 0.9, // High Openness
      },
      {
        text: "Can I trade it for a safe, all-inclusive beach resort?",
        value: 0.2, // Low Openness
      },
    ],
  },
  {
    id: 'q2_conscientiousness',
    trait: 'Conscientiousness',
    question: 'Looking at a phone screen with 50+ unread notifications/emails. How does it make you feel?',
    options: [
      {
        text: "Stressed. I need to clear them to 'Inbox Zero' right now.",
        value: 0.9, // High Conscientiousness
      },
      {
        text: "Indifferent. I'll get to them eventually... maybe.",
        value: 0.2, // Low Conscientiousness
      },
    ],
  },
  {
    id: 'q3_extraversion',
    trait: 'Extraversion',
    question: "It's Friday night after a long week. What is your ideal way to recharge?",
    options: [
      {
        text: "Hitting the town! Drinks, dinner, or a party with friends.",
        value: 0.9, // High Extraversion
      },
      {
        text: "Staying in. Takeout, pajamas, and binge-watching a series.",
        value: 0.2, // Low Extraversion
      },
    ],
  },
  {
    id: 'q4_agreeableness',
    trait: 'Agreeableness',
    question: 'You ordered a latte, but the barista gave you a cappuccino by mistake. What do you do?',
    options: [
      {
        text: "Smile and say thanks. I don't want to make a fuss.",
        value: 0.9, // High Agreeableness
      },
      {
        text: "Ask them to remake it. I want exactly what I paid for.",
        value: 0.2, // Low Agreeableness
      },
    ],
  },
  {
    id: 'q5_neuroticism',
    trait: 'Neuroticism',
    question: 'You are watching a deeply emotional, sad movie ending. Are you crying?',
    options: [
      {
        text: "Yes, I'm a mess of tears and emotions.",
        value: 0.9, // High Neuroticism
      },
      {
        text: "No, I'm pretty chill. It's just a movie.",
        value: 0.2, // Low Neuroticism
      },
    ],
  },
];

export const physicalQuestions: Question[] = [
  {
    id: 'q_space',
    trait: 'Lifestyle',
    question: 'Describe your living situation.',
    options: [
      { text: "Cozy Apartment / Studio", value: "apartment" },
      { text: "House with a small yard", value: "house_small" },
      { text: "Large home with plenty of space", value: "house_large" },
    ],
  },
  {
    id: 'q_time',
    trait: 'Lifestyle',
    question: 'How much time can you dedicate to pet care daily?',
    options: [
      { text: "Busy bee (under 30 mins)", value: "low" },
      { text: "Steady schedule (1-2 hours)", value: "medium" },
      { text: "All day free / Work from home", value: "high" },
    ],
  },
  {
    id: 'q_budget',
    trait: 'Lifestyle',
    question: 'What is your monthly budget for pet supplies?',
    options: [
      { text: "Budget-conscious ($)", value: "low" },
      { text: "Comfortable ($$)", value: "medium" },
      { text: "Spare no expense ($$$)", value: "high" },
    ],
  },
  {
    id: 'q_dealbreaker',
    trait: 'Lifestyle',
    question: 'What is your absolute NO-GO?',
    options: [
      { text: "Shedding / Fur everywhere", value: "fur" },
      { text: "Live bugs or frozen mice", value: "bugs/mice" },
      { text: "Loud noises / Barking", value: "noise" },
      { text: "I'm open to anything!", value: "none" },
    ],
  },
];
