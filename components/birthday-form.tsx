'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Birthday, BirthdaySchema } from '@/lib/definitions';
import { createBirthday, updateBirthday } from '@/lib/actions';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose
} from '@/components/ui/dialog';

interface BirthdayFormProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    birthday?: Birthday | null;
    onSuccess: () => void;
}

function SubmitButton({ isEditMode }: { isEditMode: boolean }) {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className='cursor-pointer' disabled={pending}>
            {pending ? 'Saving...' : isEditMode ? 'Save Changes' : 'Create Birthday'}
        </Button>
    );
}

export function BirthdayForm({ isOpen, setIsOpen, birthday, onSuccess }: BirthdayFormProps) {
    const isEditMode = !!birthday;
    const action = isEditMode ? updateBirthday : createBirthday;
    const previousBirthdayIdRef = useRef(birthday?._id?.toString() || '');

    const initialState = { message: "", errors: {} };
    const [state, dispatch] = useActionState(action, initialState);

    const { register, formState: { errors }, reset } = useForm({
        resolver: zodResolver(BirthdaySchema),
        defaultValues: {
            id: birthday?._id.toString() || '',
            utaiteName: birthday?.utaiteName || '',
            birthday: birthday?.birthday || '',
            twitterLink: birthday?.twitterLink || '',
        }
    });

    useEffect(() => {
        if (state.message?.startsWith('Success')) {
            toast.success(state.message);
            onSuccess();
            setIsOpen(false);
            reset({ id: '', utaiteName: '', birthday: '', twitterLink: '' });
        } else if (state.message && state.message !== "") {
            toast.error(state.message);
        }
    }, [state, setIsOpen, onSuccess, reset]);

    useEffect(() => {
        const currentBirthdayId = birthday?._id?.toString() || '';
        if (currentBirthdayId !== previousBirthdayIdRef.current) {
            reset({
                id: currentBirthdayId,
                utaiteName: birthday?.utaiteName || '',
                birthday: birthday?.birthday || '',
                twitterLink: birthday?.twitterLink || '',
            });
            previousBirthdayIdRef.current = currentBirthdayId;
        }
    }, [birthday, reset]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? 'Edit Birthday' : 'Add New Birthday'}</DialogTitle>
                </DialogHeader>
                <form action={dispatch}>
                    {isEditMode && <input type="hidden" {...register("id")} />}
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="utaiteName" className="text-right">Name</Label>
                            <Input id="utaiteName" {...register("utaiteName")} className="col-span-3" />
                            {(errors.utaiteName || state.errors?.utaiteName) && <p className="col-span-4 text-sm text-red-500 text-right">{errors.utaiteName?.message || state.errors?.utaiteName?.[0]}</p>}
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="birthday" className="text-right">Birthday</Label>
                            <Input id="birthday" placeholder="YYYY-MM-DD or MM-DD" {...register("birthday")} className="col-span-3" />
                            {(errors.birthday || state.errors?.birthday) && <p className="col-span-4 text-sm text-red-500 text-right">{errors.birthday?.message || state.errors?.birthday?.[0]}</p>}
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="twitterLink" className="text-right">Twitter URL</Label>
                            <Input id="twitterLink" placeholder="https://twitter.com/..." {...register("twitterLink")} className="col-span-3" />
                            {(errors.twitterLink || state.errors?.twitterLink) && <p className="col-span-4 text-sm text-red-500 text-right">{errors.twitterLink?.message || state.errors?.twitterLink?.[0]}</p>}
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                        <SubmitButton isEditMode={isEditMode} />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}