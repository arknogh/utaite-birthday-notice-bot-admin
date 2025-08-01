'use client';

import { useState, useEffect } from 'react';
import { getBirthdays } from "@/lib/actions";
import { BirthdayTable } from "@/components/birthday-table";
import { FilterControls } from "@/components/filter-controls";
import { Birthday, FilterValues } from '@/lib/definitions';

export default function Home() {
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [filters, setFilters] = useState<FilterValues>({
    name: 'all',
    year: 'all',
    twitter: 'all'
  });

  useEffect(() => {
    async function fetchBirthdays() {
      const bdays = await getBirthdays();
      setBirthdays(bdays);
    }
    fetchBirthdays();
  }, []);

  return (
    <main className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Utaite Birthday Dashboard</h1>
      <FilterControls filters={filters} setFilters={setFilters} />
      <BirthdayTable initialBirthdays={birthdays} filters={filters} />
    </main>
  );
}