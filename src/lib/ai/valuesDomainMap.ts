import { ALL_VALUES, VALUES_BY_ID } from '@/lib/data/values';
import { DOMAINS, DOMAINS_BY_ID } from '@/lib/data/domains';
import type { DomainId } from '@/lib/types';

// Map value name → domain name for AI context
export const VALUE_NAME_TO_DOMAIN: Record<string, string> = Object.fromEntries(
  ALL_VALUES.map((v) => [v.name, DOMAINS_BY_ID[v.domainId]?.name || 'Unknown'])
);

// Map value ID → domain name for AI context
export const VALUE_ID_TO_DOMAIN: Record<string, string> = Object.fromEntries(
  ALL_VALUES.map((v) => [v.id, DOMAINS_BY_ID[v.domainId]?.name || 'Unknown'])
);

// Get domain description for value ID
export function getDomainDescription(valueId: string): string {
  const value = VALUES_BY_ID[valueId];
  if (!value) return '';
  const domain = DOMAINS_BY_ID[value.domainId];
  return domain?.description || '';
}

// Analyze domain distribution from sorted values
export interface DomainDistribution {
  domainId: DomainId;
  domainName: string;
  count: number;
  percentage: number;
}

export function analyzeDomainDistribution(
  valueIds: string[]
): DomainDistribution[] {
  const counts: Record<DomainId, number> = {} as Record<DomainId, number>;
  const total = valueIds.length;

  // Count values per domain
  for (const id of valueIds) {
    const value = VALUES_BY_ID[id];
    if (value) {
      counts[value.domainId] = (counts[value.domainId] || 0) + 1;
    }
  }

  // Convert to array with percentages, sorted by count descending
  return DOMAINS.map((domain) => ({
    domainId: domain.id,
    domainName: domain.name,
    count: counts[domain.id] || 0,
    percentage: total > 0 ? Math.round(((counts[domain.id] || 0) / total) * 100) : 0,
  })).sort((a, b) => b.count - a.count);
}

// Get values context for AI prompt (names and domains)
export function getValuesContext(valueIds: string[]): string {
  return valueIds
    .map((id, index) => {
      const value = VALUES_BY_ID[id];
      if (!value) return null;
      const domain = DOMAINS_BY_ID[value.domainId];
      return `${index + 1}. ${value.name} (${domain?.name || 'Unknown'}) - ${value.cardText}`;
    })
    .filter(Boolean)
    .join('\n');
}

// Get full sorting context for AI
export function getSortingContext(sortedValues: {
  very: string[];
  somewhat: string[];
  less: string[];
}): string {
  const veryDistribution = analyzeDomainDistribution(sortedValues.very);
  const topDomains = veryDistribution
    .filter((d) => d.count > 0)
    .slice(0, 3)
    .map((d) => `${d.domainName} (${d.percentage}%)`)
    .join(', ');

  const lessDistribution = analyzeDomainDistribution(sortedValues.less);
  const deprioritizedDomains = lessDistribution
    .filter((d) => d.percentage > 15)
    .slice(0, 2)
    .map((d) => d.domainName)
    .join(', ');

  return `
SORTING SUMMARY:
- Very Important: ${sortedValues.very.length} values
- Somewhat Important: ${sortedValues.somewhat.length} values
- Less Important: ${sortedValues.less.length} values

DOMINANT DOMAINS (Very Important):
${topDomains || 'Evenly distributed'}

DEPRIORITIZED DOMAINS (Less Important):
${deprioritizedDomains || 'None significantly deprioritized'}
`.trim();
}
