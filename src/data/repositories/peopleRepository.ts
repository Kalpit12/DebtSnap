import { readStorage, writeStorage } from '@/lib/storage';
import type { Person } from '@/types/person';
import { generateId } from '@/utils/id';

export async function getAllPeople(): Promise<Person[]> {
  const storage = await readStorage();
  return storage.people.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

export async function getPersonById(id: string): Promise<Person | undefined> {
  const storage = await readStorage();
  return storage.people.find((person) => person.id === id);
}

export async function createPerson(input: {
  name: string;
  phone?: string;
}): Promise<Person> {
  const storage = await readStorage();
  const now = new Date().toISOString();
  const person: Person = {
    id: generateId(),
    name: input.name.trim(),
    phone: input.phone?.trim() || undefined,
    createdAt: now,
    updatedAt: now,
  };

  storage.people.push(person);
  await writeStorage(storage);
  return person;
}

export async function updatePerson(
  id: string,
  input: { name?: string; phone?: string },
): Promise<Person> {
  const storage = await readStorage();
  const index = storage.people.findIndex((person) => person.id === id);
  if (index === -1) {
    throw new Error('Person not found');
  }

  const existing = storage.people[index];
  const updated: Person = {
    ...existing,
    name: input.name?.trim() ?? existing.name,
    phone: input.phone !== undefined ? input.phone.trim() || undefined : existing.phone,
    updatedAt: new Date().toISOString(),
  };

  storage.people[index] = updated;
  await writeStorage(storage);
  return updated;
}

export async function deletePerson(id: string): Promise<void> {
  const storage = await readStorage();
  storage.people = storage.people.filter((person) => person.id !== id);
  const debtIds = storage.debts.filter((debt) => debt.personId === id).map((debt) => debt.id);
  storage.debts = storage.debts.filter((debt) => debt.personId !== id);
  storage.payments = storage.payments.filter((payment) => !debtIds.includes(payment.debtId));
  await writeStorage(storage);
}
