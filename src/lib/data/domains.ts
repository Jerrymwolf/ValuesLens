import type { Domain, DomainId } from '@/lib/types';
import { ALL_VALUES } from './values';

export const DOMAINS: Domain[] = [
  {
    id: 'integrity-character',
    name: 'Integrity & Character',
    description: 'The foundation of moral identity—who you are when no one is watching.',
  },
  {
    id: 'courage-action',
    name: 'Courage & Action',
    description: 'The will to act despite fear, uncertainty, or opposition.',
  },
  {
    id: 'care-compassion',
    name: 'Care & Compassion',
    description: 'The capacity to see, feel, and respond to the needs of others.',
  },
  {
    id: 'service-duty',
    name: 'Service & Duty',
    description: 'The commitment to contribute to something greater than oneself.',
  },
  {
    id: 'excellence-achievement',
    name: 'Excellence & Achievement',
    description: 'The drive to perform at the highest level and accomplish meaningful goals.',
  },
  {
    id: 'relationship-connection',
    name: 'Relationship & Connection',
    description: 'The bonds that connect us to others and create meaning through belonging.',
  },
  {
    id: 'growth-development',
    name: 'Growth & Development',
    description: 'The commitment to continuous learning, improvement, and human potential.',
  },
  {
    id: 'justice-fairness',
    name: 'Justice & Fairness',
    description: 'The commitment to equity, rights, and moral treatment of all.',
  },
  {
    id: 'self-direction-meaning',
    name: 'Self-Direction & Meaning',
    description: "The autonomy to chart one's own course and live with purpose.",
  },
];

// Map for O(1) lookup
export const DOMAINS_BY_ID: Record<DomainId, Domain> = DOMAINS.reduce(
  (acc, domain) => ({ ...acc, [domain.id]: domain }),
  {} as Record<DomainId, Domain>
);

// Get values by domain
export const getValuesByDomain = (domainId: DomainId) =>
  ALL_VALUES.filter((v) => v.domainId === domainId);

// Get domain for a value
export const getDomainForValue = (valueId: string): Domain | undefined => {
  const value = ALL_VALUES.find((v) => v.id === valueId);
  if (!value) return undefined;
  return DOMAINS_BY_ID[value.domainId];
};
