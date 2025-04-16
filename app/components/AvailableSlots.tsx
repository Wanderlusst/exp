import { TimeSlot } from "../lib/types";
import { formatTime } from "../lib/utils";


interface AvailableSlotsProps {
  slots: Record<string, TimeSlot[]>;
}

export default function AvailableSlots({ slots }: AvailableSlotsProps) {
  const dates = Object.keys(slots).sort();
  
  if (dates.length === 0) {
    return (
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-100 rounded-md">
        <p className="text-yellow-800">No common available slots found for the selected participants and date range.</p>
      </div>
    );
  }
  
  // Format date from API format (DD/MM/YYYY) to displayed format (DD-MM-YY)
  const formatDateForDisplay = (dateString: string): string => {
    const [day, month, year] = dateString.split('/');
    return `${day}-${month}-${year.substring(2)}`;
  };
  
  return (
    <div className="mt-6">
      <div className=" text-black bg-yellow-50 p-4 rounded-lg">
        <h2 className="text-center font-medium mb-4">Available Slot</h2>
        {dates.map(date => (
          <div key={date} className="mb-4">
            <div className="flex">
              <h3 className="font-medium mb-2 mr-2">{formatDateForDisplay(date)}</h3>
              <span>:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {slots[date]
                .sort((a, b) => a.start.localeCompare(b.start))
                .map((slot, idx) => (
                  <div 
                    key={idx} 
                    className="bg-blue-600 text-white text-sm py-1 px-4 rounded-full"
                  >
                    {formatTime(slot.start)} - {formatTime(slot.end)}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}