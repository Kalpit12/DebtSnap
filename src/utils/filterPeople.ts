import type { Person } from '@/types/person';

export function filterPeople(people: Person[], query: string): Person[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return people;
  }

  return people.filter(
    (person) =>
      person.name.toLowerCase().includes(normalized) ||
      (person.phone?.toLowerCase().includes(normalized) ?? false),
  );
}
