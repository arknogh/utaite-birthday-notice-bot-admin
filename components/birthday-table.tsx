'use client';

import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import {
    Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { BirthdayForm } from './birthday-form';
import { deleteBirthday } from '@/lib/actions';
import { Birthday } from '@/lib/definitions';
import { PaginationControls } from './pagination-controls';

export function BirthdayTable({ initialBirthdays }: { initialBirthdays: Birthday[] }) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedBirthday, setSelectedBirthday] = useState<Birthday | null>(null);
    
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [birthdayToDelete, setBirthdayToDelete] = useState<string | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const paginatedBirthdays = useMemo(() => {
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        return initialBirthdays.slice(startIndex, endIndex);
    }, [initialBirthdays, currentPage, rowsPerPage]);


    const handleAdd = () => {
        setSelectedBirthday(null);
        setIsFormOpen(true);
    };

    const handleEdit = (birthday: Birthday) => {
        setSelectedBirthday(birthday);
        setIsFormOpen(true);
    };

    const handleDeleteClick = (id: string) => {
        setBirthdayToDelete(id);
        setIsAlertOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!birthdayToDelete) return;

        const result = await deleteBirthday(birthdayToDelete);
        if (result.message?.startsWith('Success')) {
            toast.success(result.message);
        } else {
            toast.error(result.message || 'An unknown error occurred.');
        }
        
        setIsAlertOpen(false);
        setBirthdayToDelete(null);
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
                    {paginatedBirthdays.map((bday) => (
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
                                <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(bday._id.toString())}>Delete</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
        <PaginationControls
            totalRows={initialBirthdays.length}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
        />
        <BirthdayForm
            isOpen={isFormOpen}
            setIsOpen={setIsFormOpen}
            birthday={selectedBirthday}
        />

        {/* The Delete Confirmation Dialog */}
        <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the
                        birthday from the database.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setBirthdayToDelete(null)}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirmDelete}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        </>
    );
}
