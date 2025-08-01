import { z } from 'zod';
import { ObjectId } from 'mongodb';

export const BirthdaySchema = z.object({
    id: z.string().optional,
    utaiteName: z.string().min(1, { message: "Name is required." }),
    birthday: z.string().regex(/^(\d{4}-)?\d{2}-\d{2}$/, {
        message: "Date must be in YYYY-MM-DD or MM-DD format.",
    }),
    twitterLink: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
});

export type Birthday = {
    _id: ObjectId;
    utaiteName: string;
    birthday: string;
    twitterLink?: string;
    createdAt: Date;
};