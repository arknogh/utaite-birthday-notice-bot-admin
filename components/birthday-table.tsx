'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import {
    Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { BirthdayForm } from './birthday-form';
import { deleteBirthday } from '@/lib/actions';
import { Birthday } from '@/lib/definitions';

export function BirthdayTable({ initialBirthdays }: { initialBirthdays: Birthday[] }) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedBirthday, setSelectedBirthday] = useState<Birthday | null>(null);

    const handleAdd = () => {
        setSelectedBirthday(null);
        setIsFormOpen(true);
    };

    const handleEdit = (birthday: Birthday) => {
        setSelectedBirthday(birthday);
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this birthday?')) {
        const result = await deleteBirthday(id);
        if (result.message?.startsWith('Success')) {
            toast.success(result.message);
        } else {
            toast.error(result.message || 'An unknown error occurred.');
        }
        }
    };

    return (
        <>
        <div className="flex justify-end mb-4">
            <Button onClick={handleAdd}>Add Birthday</Button>
        </div>
        <div className="rounded-md border">
            <Table>
                <TableCaption>A list of birthdays in the database.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[250px]">Name</TableHead>
                        <TableHead>Birthday</TableHead>
                        <TableHead>Twitter</TableHead>
                        <TableHead className="text-right w-[200px]">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {initialBirthdays.map((bday) => (
                    <TableRow key={bday._id.toString()}>
                        <TableCell className="font-medium">{bday.utaiteName}</TableCell>
                        <TableCell>{bday.birthday}</TableCell>
                        <TableCell>
                            {bday.twitterLink ? (
                                <a href={bday.twitterLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                                Link
                                </a>
                            ) : ('N/A')}
                        </TableCell>
                        <TableCell className="text-right">
                            <Button variant="outline" size="sm" className="mr-2" onClick={() => handleEdit(bday)}>Edit</Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDelete(bday._id.toString())}>Delete</Button>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
        <BirthdayForm
            isOpen={isFormOpen}
            setIsOpen={setIsFormOpen}
            birthday={selectedBirthday}
        />
        </>
    );
}