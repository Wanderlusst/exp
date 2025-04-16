"use client";

import { useState, useEffect } from 'react';
import { participants } from '../lib/data';
import { TimeSlot } from '../lib/types';
import { checkParticipantAvailableSlots } from '../lib/utils';
import AvailableSlots from './AvailableSlots';


export default function SlotsFinder() {
    const [selectedParticipants, setSelectedParticipants] = useState<number[]>([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [availableSlots, setAvailableSlots] = useState<Record<string, TimeSlot[]>>({});
    const [hasChecked, setHasChecked] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleParticipantToggle = (id: number) => {
        if (selectedParticipants.includes(id)) {
            setSelectedParticipants(selectedParticipants.filter(p => p !== id));
        } else {
            setSelectedParticipants([...selectedParticipants, id]);
        }
    };

    const handleCheckSlots = () => {
        if (selectedParticipants.length === 0 || !startDate || !endDate) {
            alert('Please select participants and date range');
            return;
        }

        const formattedStartDate = formatDateForApi(startDate);
        const formattedEndDate = formatDateForApi(endDate);

        const slots = checkParticipantAvailableSlots(
            selectedParticipants,
            { start: formattedStartDate, end: formattedEndDate }
        );

        setAvailableSlots(slots);
        setHasChecked(true);
    };

    // Format date from input field (YYYY-MM-DD) to API format (DD/MM/YYYY)
    const formatDateForApi = (dateString: string): string => {
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    };

    // Format date from API format (DD/MM/YYYY) to displayed format (DD-MM-YY)
    const formatDateForDisplay = (dateString: string): string => {
        const [day, month, year] = dateString.split('/');
        return `${day}-${month}-${year.substring(2)}`;
    };

    return (
        <div className="max-w-md mx-auto pt-8">
            <h1 className="text-2xl font-medium text-center mb-6">Check Availability</h1>

            {/* Participants Dropdown */}
            <div className="mb-4 relative">
                <div
                    className="bg-gray-100 p-3 rounded border border-gray-300 flex justify-between items-center cursor-pointer"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                    <div className="text-gray-600">
                        {selectedParticipants.length > 0
                            ? `${selectedParticipants.length} participants selected`
                            : 'Choose Participants'}
                    </div>
                    <svg
                        width="12"
                        height="6"
                        viewBox="0 0 12 6"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className={`transform ${isDropdownOpen ? 'rotate-180' : ''} transition-transform`}
                    >
                        <path d="M6 6L0 0H12L6 6Z" fill="#666" />
                    </svg>
                </div>

                {isDropdownOpen && (
                    <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-10">
                        {Object.entries(participants).map(([id, participant]) => (
                            <div key={id} className="p-2 hover:bg-gray-100">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedParticipants.includes(Number(id))}
                                        onChange={() => handleParticipantToggle(Number(id))}
                                        className="form-checkbox"
                                    />
                                    <span>{participant.name}</span>
                                </label>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Date Inputs */}
            <div className="grid grid-cols-1 gap-4 mb-4">
                <div className="relative" onClick={() => document.getElementById("start-date")?.focus()}>
                    <label className="text-sm text-gray-600 mb-1 block">Start Date</label>
                    <input
                        id="start-date"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full p-3 bg-gray-100 rounded border border-gray-300"
                    />
                    <div className="absolute right-3 top-9 text-gray-400 pointer-events-none">
                        {/* calendar icon */}
                    </div>
                </div>


                <div className="relative" onClick={() => document.getElementById("end-date")?.focus()}>
                    <label className="text-sm text-gray-600 mb-1 block">End Date</label>
                    <input
                        id="end-date"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full p-3 bg-gray-100 rounded border border-gray-300"
                    />
                    <div className="absolute right-3 top-9 text-gray-400 pointer-events-none">
                        {/* calendar icon */}
                    </div>
                </div>

            </div>

            {/* Check Slots Button */}
            <button
                onClick={handleCheckSlots}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded font-medium hover:bg-blue-700 transition"
            >
                Check Slots
            </button>

            {/* Available Slots Display */}
            {hasChecked && <AvailableSlots slots={availableSlots} />}
        </div>
    );
}