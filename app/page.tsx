import { getBirthdays } from "@/lib/actions";
import { BirthdayTable } from "@/components/birthday-table"; 

export default async function Home() {
  const birthdays = await getBirthdays();

  return (
    <main className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Utaite Birthday Dashboard</h1>
      <BirthdayTable initialBirthdays={birthdays} />
    </main>
  );
}
