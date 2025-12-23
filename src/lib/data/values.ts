import type { Value } from '@/lib/types';

export const ALL_VALUES: Value[] = [
  // DOMAIN 1: Integrity & Character (10)
  { id: 'integrity', name: 'Integrity', cardText: 'Alignment between words and actions', domainId: 'integrity-character', source: 'ValuesPrism' },
  { id: 'honesty', name: 'Honesty', cardText: 'Truthfulness in communication', domainId: 'integrity-character', source: 'ValuesPrism' },
  { id: 'honor', name: 'Honor', cardText: 'Living by a code of principles', domainId: 'integrity-character', source: 'ValuesPrism' },
  { id: 'authenticity', name: 'Authenticity', cardText: 'Being true to yourself', domainId: 'integrity-character', source: 'Schwartz' },
  { id: 'accountability', name: 'Accountability', cardText: 'Owning outcomes and consequences', domainId: 'integrity-character', source: 'ValuesPrism' },
  { id: 'responsibility', name: 'Responsibility', cardText: 'Taking ownership of duties', domainId: 'integrity-character', source: 'ValuesPrism' },
  { id: 'dignity', name: 'Dignity', cardText: 'Inherent worth of every person', domainId: 'integrity-character', source: 'ValuesPrism' },
  { id: 'humility', name: 'Humility', cardText: 'Accurate self-assessment', domainId: 'integrity-character', source: 'Schwartz' },
  { id: 'transparency', name: 'Transparency', cardText: 'Openness in dealings', domainId: 'integrity-character', source: 'Rokeach' },
  { id: 'consistency', name: 'Consistency', cardText: 'Reliable behavior over time', domainId: 'integrity-character', source: 'Rokeach' },

  // DOMAIN 2: Courage & Action (10)
  { id: 'courage', name: 'Courage', cardText: 'Acting despite fear', domainId: 'courage-action', source: 'ValuesPrism' },
  { id: 'speaking-up', name: 'Speaking-Up', cardText: 'Voicing truth to power', domainId: 'courage-action', source: 'ValuesPrism' },
  { id: 'perseverance', name: 'Perseverance', cardText: 'Persistence through difficulty', domainId: 'courage-action', source: 'Schwartz' },
  { id: 'resilience', name: 'Resilience', cardText: 'Bouncing back from setbacks', domainId: 'courage-action', source: 'Schwartz' },
  { id: 'initiative', name: 'Initiative', cardText: 'Taking action without prompting', domainId: 'courage-action', source: 'Rokeach' },
  { id: 'decisiveness', name: 'Decisiveness', cardText: 'Making timely decisions', domainId: 'courage-action', source: 'Rokeach' },
  { id: 'adventure', name: 'Adventure', cardText: 'Seeking new experiences', domainId: 'courage-action', source: 'Schwartz' },
  { id: 'boldness', name: 'Boldness', cardText: 'Taking confident risks', domainId: 'courage-action', source: 'Schwartz' },
  { id: 'assertiveness', name: 'Assertiveness', cardText: 'Standing firm on beliefs', domainId: 'courage-action', source: 'Rokeach' },
  { id: 'conviction', name: 'Conviction', cardText: 'Strong belief in principles', domainId: 'courage-action', source: 'Rokeach' },

  // DOMAIN 3: Care & Compassion (10)
  { id: 'care', name: 'Care', cardText: "Attentiveness to others' wellbeing", domainId: 'care-compassion', source: 'ValuesPrism' },
  { id: 'compassion', name: 'Compassion', cardText: 'Feeling with those who suffer', domainId: 'care-compassion', source: 'ValuesPrism' },
  { id: 'empathy', name: 'Empathy', cardText: "Understanding others' perspectives", domainId: 'care-compassion', source: 'ValuesPrism' },
  { id: 'kindness', name: 'Kindness', cardText: 'Benevolent actions toward others', domainId: 'care-compassion', source: 'Schwartz' },
  { id: 'generosity', name: 'Generosity', cardText: 'Giving freely without expectation', domainId: 'care-compassion', source: 'Schwartz' },
  { id: 'patience', name: 'Patience', cardText: 'Calm endurance without complaint', domainId: 'care-compassion', source: 'Rokeach' },
  { id: 'forgiveness', name: 'Forgiveness', cardText: 'Releasing resentment', domainId: 'care-compassion', source: 'Schwartz' },
  { id: 'nurturing', name: 'Nurturing', cardText: 'Fostering growth in others', domainId: 'care-compassion', source: 'ValuesPrism' },
  { id: 'gentleness', name: 'Gentleness', cardText: 'Soft strength in interactions', domainId: 'care-compassion', source: 'Rokeach' },
  { id: 'presence', name: 'Presence', cardText: 'Being fully attentive in the moment', domainId: 'care-compassion', source: 'ValuesPrism' },

  // DOMAIN 4: Service & Duty (10)
  { id: 'service', name: 'Service', cardText: "Contributing to others' needs", domainId: 'service-duty', source: 'ValuesPrism' },
  { id: 'duty', name: 'Duty', cardText: 'Fulfilling obligations faithfully', domainId: 'service-duty', source: 'ValuesPrism' },
  { id: 'mission', name: 'Mission', cardText: 'Dedication to a greater purpose', domainId: 'service-duty', source: 'ValuesPrism' },
  { id: 'sacrifice', name: 'Sacrifice', cardText: "Giving up for others' benefit", domainId: 'service-duty', source: 'Schwartz' },
  { id: 'stewardship', name: 'Stewardship', cardText: 'Careful management of resources', domainId: 'service-duty', source: 'ValuesPrism' },
  { id: 'citizenship', name: 'Citizenship', cardText: 'Active participation in community', domainId: 'service-duty', source: 'Rokeach' },
  { id: 'volunteerism', name: 'Volunteerism', cardText: 'Freely giving time and effort', domainId: 'service-duty', source: 'Rokeach' },
  { id: 'philanthropy', name: 'Philanthropy', cardText: 'Generous giving for public good', domainId: 'service-duty', source: 'Rokeach' },
  { id: 'legacy', name: 'Legacy', cardText: 'Creating lasting positive impact', domainId: 'service-duty', source: 'ValuesPrism' },
  { id: 'mentorship', name: 'Mentorship', cardText: "Guiding others' development", domainId: 'service-duty', source: 'ValuesPrism' },

  // DOMAIN 5: Excellence & Achievement (10)
  { id: 'excellence', name: 'Excellence', cardText: 'Striving for the highest quality', domainId: 'excellence-achievement', source: 'ValuesPrism' },
  { id: 'achievement', name: 'Achievement', cardText: 'Accomplishing meaningful goals', domainId: 'excellence-achievement', source: 'Schwartz' },
  { id: 'competence', name: 'Competence', cardText: 'Demonstrating skill and ability', domainId: 'excellence-achievement', source: 'Schwartz' },
  { id: 'standards', name: 'Standards', cardText: 'Maintaining high expectations', domainId: 'excellence-achievement', source: 'ValuesPrism' },
  { id: 'ambition', name: 'Ambition', cardText: 'Drive to succeed and improve', domainId: 'excellence-achievement', source: 'Schwartz' },
  { id: 'discipline', name: 'Discipline', cardText: 'Self-control in pursuit of goals', domainId: 'excellence-achievement', source: 'Rokeach' },
  { id: 'focus', name: 'Focus', cardText: 'Concentrated attention on priorities', domainId: 'excellence-achievement', source: 'ValuesPrism' },
  { id: 'efficiency', name: 'Efficiency', cardText: 'Maximizing results with resources', domainId: 'excellence-achievement', source: 'Rokeach' },
  { id: 'recognition', name: 'Recognition', cardText: 'Acknowledgment of contributions', domainId: 'excellence-achievement', source: 'Schwartz' },
  { id: 'mastery', name: 'Mastery', cardText: 'Deep expertise through practice', domainId: 'excellence-achievement', source: 'ValuesPrism' },

  // DOMAIN 6: Relationship & Connection (10)
  { id: 'trust', name: 'Trust', cardText: "Confidence in others' reliability", domainId: 'relationship-connection', source: 'ValuesPrism' },
  { id: 'loyalty', name: 'Loyalty', cardText: 'Faithful commitment to people', domainId: 'relationship-connection', source: 'ValuesPrism' },
  { id: 'belonging', name: 'Belonging', cardText: 'Feeling part of a group', domainId: 'relationship-connection', source: 'Schwartz' },
  { id: 'family', name: 'Family', cardText: 'Prioritizing family bonds', domainId: 'relationship-connection', source: 'Rokeach' },
  { id: 'friendship', name: 'Friendship', cardText: 'Valuing close personal bonds', domainId: 'relationship-connection', source: 'Rokeach' },
  { id: 'community', name: 'Community', cardText: 'Connection to local groups', domainId: 'relationship-connection', source: 'ValuesPrism' },
  { id: 'collaboration', name: 'Collaboration', cardText: 'Working together effectively', domainId: 'relationship-connection', source: 'ValuesPrism' },
  { id: 'respect', name: 'Respect', cardText: "Honoring others' worth", domainId: 'relationship-connection', source: 'Schwartz' },
  { id: 'inclusion', name: 'Inclusion', cardText: 'Welcoming all into belonging', domainId: 'relationship-connection', source: 'ValuesPrism' },
  { id: 'communication', name: 'Communication', cardText: 'Clear exchange of ideas', domainId: 'relationship-connection', source: 'Rokeach' },

  // DOMAIN 7: Growth & Development (10)
  { id: 'development', name: 'Development', cardText: 'Continuous personal improvement', domainId: 'growth-development', source: 'ValuesPrism' },
  { id: 'learning', name: 'Learning', cardText: 'Acquiring new knowledge', domainId: 'growth-development', source: 'Schwartz' },
  { id: 'empowerment', name: 'Empowerment', cardText: 'Enabling others to act', domainId: 'growth-development', source: 'ValuesPrism' },
  { id: 'curiosity', name: 'Curiosity', cardText: 'Desire to explore and understand', domainId: 'growth-development', source: 'Schwartz' },
  { id: 'innovation', name: 'Innovation', cardText: 'Creating new solutions', domainId: 'growth-development', source: 'ValuesPrism' },
  { id: 'creativity', name: 'Creativity', cardText: 'Generating original ideas', domainId: 'growth-development', source: 'Schwartz' },
  { id: 'wisdom', name: 'Wisdom', cardText: 'Applying knowledge with judgment', domainId: 'growth-development', source: 'Rokeach' },
  { id: 'open-mindedness', name: 'Open-Mindedness', cardText: 'Receptivity to new ideas', domainId: 'growth-development', source: 'Schwartz' },
  { id: 'adaptability', name: 'Adaptability', cardText: 'Flexibility in changing conditions', domainId: 'growth-development', source: 'ValuesPrism' },
  { id: 'self-awareness', name: 'Self-Awareness', cardText: "Understanding one's own nature", domainId: 'growth-development', source: 'ValuesPrism' },

  // DOMAIN 8: Justice & Fairness (10)
  { id: 'fairness', name: 'Fairness', cardText: 'Impartial treatment of all', domainId: 'justice-fairness', source: 'Schwartz' },
  { id: 'justice', name: 'Justice', cardText: 'Upholding what is right', domainId: 'justice-fairness', source: 'ValuesPrism' },
  { id: 'equality', name: 'Equality', cardText: 'Equal worth and opportunity', domainId: 'justice-fairness', source: 'Schwartz' },
  { id: 'equity', name: 'Equity', cardText: 'Fair distribution based on need', domainId: 'justice-fairness', source: 'ValuesPrism' },
  { id: 'rights', name: 'Rights', cardText: 'Protecting fundamental freedoms', domainId: 'justice-fairness', source: 'Rokeach' },
  { id: 'liberty', name: 'Liberty', cardText: 'Freedom from oppression', domainId: 'justice-fairness', source: 'Rokeach' },
  { id: 'safety', name: 'Safety', cardText: 'Protection from harm', domainId: 'justice-fairness', source: 'Schwartz' },
  { id: 'security', name: 'Security', cardText: 'Stability and freedom from threat', domainId: 'justice-fairness', source: 'Schwartz' },
  { id: 'advocacy', name: 'Advocacy', cardText: "Speaking up for others' rights", domainId: 'justice-fairness', source: 'ValuesPrism' },
  { id: 'voice', name: 'Voice', cardText: 'Power to express and be heard', domainId: 'justice-fairness', source: 'ValuesPrism' },

  // DOMAIN 9: Self-Direction & Meaning (10)
  { id: 'freedom', name: 'Freedom', cardText: "Autonomy to choose one's path", domainId: 'self-direction-meaning', source: 'Schwartz' },
  { id: 'independence', name: 'Independence', cardText: 'Self-reliance in decisions', domainId: 'self-direction-meaning', source: 'Schwartz' },
  { id: 'purpose', name: 'Purpose', cardText: 'Sense of meaningful direction', domainId: 'self-direction-meaning', source: 'ValuesPrism' },
  { id: 'faith', name: 'Faith', cardText: 'Trust in something greater', domainId: 'self-direction-meaning', source: 'Rokeach' },
  { id: 'gratitude', name: 'Gratitude', cardText: 'Appreciation for what one has', domainId: 'self-direction-meaning', source: 'Schwartz' },
  { id: 'joy', name: 'Joy', cardText: 'Deep contentment and happiness', domainId: 'self-direction-meaning', source: 'Rokeach' },
  { id: 'balance', name: 'Balance', cardText: 'Harmony among life priorities', domainId: 'self-direction-meaning', source: 'ValuesPrism' },
  { id: 'simplicity', name: 'Simplicity', cardText: 'Clarity through reduction', domainId: 'self-direction-meaning', source: 'Rokeach' },
  { id: 'health', name: 'Health', cardText: 'Physical and mental wellbeing', domainId: 'self-direction-meaning', source: 'Rokeach' },
  { id: 'peace', name: 'Peace', cardText: 'Inner calm and outer harmony', domainId: 'self-direction-meaning', source: 'Schwartz' },
];

// Validate count
if (ALL_VALUES.length !== 90) {
  throw new Error(`Expected 90 values, got ${ALL_VALUES.length}`);
}

// Map for O(1) lookup by ID
export const VALUES_BY_ID: Record<string, Value> = ALL_VALUES.reduce(
  (acc, value) => ({ ...acc, [value.id]: value }),
  {} as Record<string, Value>
);

// Map for O(1) lookup by name
export const VALUES_BY_NAME: Record<string, Value> = ALL_VALUES.reduce(
  (acc, value) => ({ ...acc, [value.name]: value }),
  {} as Record<string, Value>
);

// Get value by ID helper
export const getValueById = (id: string): Value | undefined => VALUES_BY_ID[id];

// Get value by name helper
export const getValueByName = (name: string): Value | undefined => VALUES_BY_NAME[name];
