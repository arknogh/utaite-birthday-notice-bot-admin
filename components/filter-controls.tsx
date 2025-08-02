'use client';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FilterValues } from "@/lib/definitions";

interface FilterControlsProps {
    filters: FilterValues;
    setFilters: (filters: FilterValues) => void;
}

export function FilterControls({ filters, setFilters }: FilterControlsProps) {
    const nameOptions = "abcdefghijklmnopqrstuvwxyz#".split('');
    const monthOptions = [
        { value: 'all', label: 'All' },
        { value: '01', label: 'January' },
        { value: '02', label: 'February' },
        { value: '03', label: 'March' },
        { value: '04', label: 'April' },
        { value: '05', label: 'May' },
        { value: '06', label: 'June' },
        { value: '07', label: 'July' },
        { value: '08', label: 'August' },
        { value: '09', label: 'September' },
        { value: '10', label: 'October' },
        { value: '11', label: 'November' },
        { value: '12', label: 'December' },
    ];
    const dayOptions = ['all', ...Array.from({ length: 31 }, (_, i) => String(i + 1))];


    const handleFilterChange = (key: keyof FilterValues, value: string) => {
        setFilters({ ...filters, [key]: value });
    };
    
    return (
        <div className="flex items-center space-x-4 mb-4">
            <div>
                <Label htmlFor="search-filter">Search</Label>
                <Input
                    id="search-filter"
                    placeholder="Search by name..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="w-[200px]"
                />
            </div>
            <div>
                <Label htmlFor="name-filter">Name starts with</Label>
                <Select value={filters.name} onValueChange={(value) => handleFilterChange('name', value)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {nameOptions.map(option => (
                            <SelectItem key={option} value={option}>{option.toUpperCase()}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor="month-filter">Month</Label>
                <Select value={filters.month} onValueChange={(value) => handleFilterChange('month', value)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                        {monthOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor="day-filter">Day</Label>
                <Select value={filters.day} onValueChange={(value) => handleFilterChange('day', value)}>
                    <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                        {dayOptions.map(option => (
                            <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor="year-filter">Has year</Label>
                <Select value={filters.year} onValueChange={(value) => handleFilterChange('year', value)}>
                    <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor="twitter-filter">Has Twitter</Label>
                <Select value={filters.twitter} onValueChange={(value) => handleFilterChange('twitter', value)}>
                    <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}