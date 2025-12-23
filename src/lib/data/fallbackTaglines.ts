export const FALLBACK_TAGLINES: Record<string, string> = {
  // Integrity & Character
  Integrity: 'Truth in action',
  Honesty: 'Words that match',
  Honor: 'Living the code',
  Authenticity: 'Truly yourself',
  Accountability: 'Owning it all',
  Responsibility: 'The weight you carry',
  Dignity: 'Worth in everyone',
  Humility: 'Accurate mirror',
  Transparency: 'Nothing hidden',
  Consistency: 'Reliably you',

  // Courage & Action
  Courage: 'Fear into forward',
  'Speaking-Up': 'Voice over comfort',
  Perseverance: 'Through the wall',
  Resilience: 'Bounce back strong',
  Initiative: 'First to move',
  Decisiveness: 'Choose and commit',
  Adventure: 'Into the unknown',
  Boldness: 'Risk with confidence',
  Assertiveness: 'Stand your ground',
  Conviction: 'Unshakeable belief',

  // Care & Compassion
  Care: 'Seeing the need',
  Compassion: 'Feeling with others',
  Empathy: 'In their shoes',
  Kindness: 'Small acts matter',
  Generosity: 'Give freely',
  Patience: 'Time as gift',
  Forgiveness: 'Releasing the grip',
  Nurturing: 'Growing others',
  Gentleness: 'Soft strength',
  Presence: 'Fully here now',

  // Service & Duty
  Service: 'Others before self',
  Duty: 'Honor the obligation',
  Mission: 'Greater than me',
  Sacrifice: 'Giving up for',
  Stewardship: 'Careful keeper',
  Citizenship: 'Part of whole',
  Volunteerism: 'Time freely given',
  Philanthropy: 'Generous heart',
  Legacy: 'What remains',
  Mentorship: 'Lighting the way',

  // Excellence & Achievement
  Excellence: 'Nothing but best',
  Achievement: 'Goals realized',
  Competence: 'Skill demonstrated',
  Standards: 'Bar stays high',
  Ambition: 'Always reaching',
  Discipline: 'Controlled pursuit',
  Focus: 'One thing matters',
  Efficiency: 'Maximum from minimum',
  Recognition: 'Seen and valued',
  Mastery: 'Deep expertise',

  // Relationship & Connection
  Trust: 'Safe to rely',
  Loyalty: 'Standing with you',
  Belonging: 'Part of us',
  Family: 'First circle',
  Friendship: 'Chosen bonds',
  Community: 'Together stronger',
  Collaboration: 'Better together',
  Respect: 'Honoring worth',
  Inclusion: 'Room for all',
  Communication: 'Clear connection',

  // Growth & Development
  Development: 'Always becoming',
  Learning: 'Forever student',
  Empowerment: 'Unlocking others',
  Curiosity: 'Need to know',
  Innovation: 'New solutions',
  Creativity: 'Original thinking',
  Wisdom: 'Knowledge applied',
  'Open-Mindedness': 'Room for new',
  Adaptability: 'Flex and flow',
  'Self-Awareness': 'Knowing yourself',

  // Justice & Fairness
  Fairness: 'Equal treatment',
  Justice: 'Right prevails',
  Equality: 'Same for all',
  Equity: 'What each needs',
  Rights: 'Freedoms protected',
  Liberty: 'Free to be',
  Safety: 'Harm prevented',
  Security: 'Stable ground',
  Advocacy: 'Voice for voiceless',
  Voice: 'Being heard',

  // Self-Direction & Meaning
  Freedom: 'Choosing your path',
  Independence: 'Self-reliant',
  Purpose: 'Reason for being',
  Faith: 'Trust beyond',
  Gratitude: 'Thankful heart',
  Joy: 'Deep happiness',
  Balance: 'Harmony found',
  Simplicity: 'Less is more',
  Health: 'Mind and body',
  Peace: 'Inner calm',
};

export const getFallbackTagline = (valueName: string): string => {
  return FALLBACK_TAGLINES[valueName] || 'Your core value';
};
