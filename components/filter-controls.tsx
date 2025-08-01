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