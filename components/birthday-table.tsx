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
import { Birthday, FilterValues } from '@/lib/definitions';
import { PaginationControls } from './pagination-controls';
import { ArrowUpDown } from 'lucide-react';
import Link from 'next/link';

type SortKey = 'utaiteName' | 'birthday';

const Header = ({
    children,
    sortKey,
    sorting,
    setSorting,
    className
}: {
    children: React.ReactNode;
    sortKey: SortKey;
    sorting: { key: SortKey; direction: 'ascending' | 'descending' };
    setSorting: (sorting: { key: SortKey; direction: 'ascending' | 'descending' }) => void;
    className?: string;
}) => {
    const isSorted = sorting.key === sortKey;
    const isAscending = sorting.direction === 'ascending';

    const handleClick = () => {
        if (isSorted) {
            setSorting({ key: sortKey, direction: isAscending ? 'descending' : 'ascending' });
        } else {
            setSorting({ key: sortKey, direction: 'ascending' });
        }
    };

    return (
        <TableHead className={className}>
            <Button variant="ghost" onClick={handleClick}>
                {children}
                <ArrowUpDown className={`ml-2 h-4 w-4 ${isSorted ? 'text-blue-500' : ''}`} />
            </Button>
        </TableHead>
    );
};

export function BirthdayTable({ initialBirthdays, filters }: { initialBirthdays: Birthday[], filters: FilterValues }) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedBirthday, setSelectedBirthday] = useState<Birthday | null>(null);
    
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [birthdayToDelete, setBirthdayToDelete] = useState<string | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sorting, setSorting] = useState<{ key: SortKey; direction: 'ascending' | 'descending' }>({ key: 'utaiteName', direction: 'ascending' });

    const filteredAndSortedBirthdays = useMemo(() => {
        let filtered = initialBirthdays;

        if (filters.name && filters.name !== 'all') {
            const firstChar = filters.name.toLowerCase();
            if (firstChar === '#') {
                filtered = filtered.filter(b => !/^[a-z]/i.test(b.utaiteName.charAt(0)));
            } else {
                filtered = filtered.filter(b => b.utaiteName.toLowerCase().startsWith(firstChar));
            }
        }

        if (filters.year && filters.year !== 'all') {
            if (filters.year === 'yes') {
                filtered = filtered.filter(b => /^\d{4}/.test(b.birthday));
            } else if (filters.year === 'no') {
                filtered = filtered.filter(b => !/^\d{4}/.test(b.birthday));
            }
        }

        if (filters.twitter && filters.twitter !== 'all') {
            if (filters.twitter === 'yes') {
                filtered = filtered.filter(b => b.twitterLink && b.twitterLink.trim() !== '');
            } else if (filters.twitter === 'no') {
                filtered = filtered.filter(b => !b.twitterLink || b.twitterLink.trim() === '');
            }
        }

        const sorted = [...filtered].sort((a, b) => {
            const aValue = a[sorting.key];
            const bValue = b[sorting.key];

            if (aValue < bValue) {
                return sorting.direction === 'ascending' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sorting.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });

        return sorted;

    }, [initialBirthdays, filters, sorting]);

    const paginatedBirthdays = useMemo(() => {
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        return filteredAndSortedBirthdays.slice(startIndex, endIndex);
    }, [filteredAndSortedBirthdays, currentPage, rowsPerPage]);


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
                    <Header sortKey="utaiteName" sorting={sorting} setSorting={setSorting} className="w-[250px]">
                        Name
                    </Header>
                    <Header sortKey="birthday" sorting={sorting} setSorting={setSorting}>
                        Birthday
                    </Header>
                    <TableHead>Twitter</TableHead>
                    <TableHead className="text-right w-[200px]">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedBirthdays.map((bday) => (
                        <TableRow key={bday._id.toString()}>
                            <TableCell className="font-medium"><Link className='text-blue-500 hover:text-blue-800 dark:text-blue-400 hover:dark:text-violet-300' href={`https://utaite.fandom.com/wiki/${bday.utaiteName}`} target='_blank'>{bday.utaiteName}</Link></TableCell>
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
            totalRows={filteredAndSortedBirthdays.length}
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