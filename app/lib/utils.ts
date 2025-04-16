import { TimeSlot, OverlappingSlot, Schedule, ParticipantAvailability } from "./types";
import { participants, participantAvailability, schedules } from "./data";

export function getWeekDay(dateStr: string): string {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const [day, month, year] = dateStr.split("/").map(Number);
  const date = new Date(year, month - 1, day);
  return days[date.getDay()];
}

export function isTimeInSlot(time: string, slot: TimeSlot): boolean {
  return time >= slot.start && time < slot.end;
}

export function isSlotInSlot(subSlot: TimeSlot, parentSlot: TimeSlot): boolean {
  return subSlot.start >= parentSlot.start && subSlot.end <= parentSlot.end;
}

export function doSlotsOverlap(slot1: TimeSlot, slot2: TimeSlot): boolean {
  return (slot1.start < slot2.end && slot1.end > slot2.start);
}

export function getDatesInRange(startDate: string, endDate: string): string[] {
  const result: string[] = [];
  const [startDay, startMonth, startYear] = startDate.split("/").map(Number);
  const [endDay, endMonth, endYear] = endDate.split("/").map(Number);
  const start = new Date(startYear, startMonth - 1, startDay);
  const end = new Date(endYear, endMonth - 1, endDay);
  const current = new Date(start);
  while (current <= end) {
    const day = current.getDate().toString().padStart(2, '0');
    const month = (current.getMonth() + 1).toString().padStart(2, '0');
    const year = current.getFullYear();
    result.push(`${day}/${month}/${year}`);
    current.setDate(current.getDate() + 1);
  }
  return result;
}

export function generateTimeSlots(startTime: string, endTime: string): TimeSlot[] {
  const slots: TimeSlot[] = [];
  let [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);
  const endTimeInMinutes = endHour * 60 + endMinute;
  while (startHour * 60 + startMinute < endTimeInMinutes) {
    const start = `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`;
    startMinute += 30;
    if (startMinute >= 60) {
      startHour += 1;
      startMinute -= 60;
    }
    if (startHour * 60 + startMinute > endTimeInMinutes) {
      break;
    }
    const end = `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`;
    slots.push({ start, end });
  }
  return slots;
}

export function formatTime(time: string): string {
  const [hourStr, minuteStr] = time.split(':');
  const hour = parseInt(hourStr, 10);
  const minute = minuteStr;
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minute} ${period}`;
}

export function checkParticipantAvailableSlots(
  participantIds: number[],
  dateRange: { start: string; end: string }
): Record<string, TimeSlot[]> {
  const result: Record<string, TimeSlot[]> = {};
  const dates = getDatesInRange(dateRange.start, dateRange.end);
  for (const date of dates) {
    const weekDay = getWeekDay(date);
    const availableSlotsForDate: TimeSlot[] = [];
    const participantsAvailableTimes: Record<number, TimeSlot[]> = {};
    for (const participantId of participantIds) {
      const participantAvailableSlots: TimeSlot[] = [];
      const weekdayAvailability = participantAvailability[participantId]?.[weekDay] || [];
      for (const slot of weekdayAvailability) {
        const thirtyMinuteSlots = generateTimeSlots(slot.start, slot.end);
        for (const thirtyMinSlot of thirtyMinuteSlots) {
          let isSlotAvailable = true;
          const participantSchedule = schedules[participantId]?.[date] || [];
          for (const meeting of participantSchedule) {
            if (doSlotsOverlap(thirtyMinSlot, meeting)) {
              isSlotAvailable = false;
              break;
            }
          }
          if (isSlotAvailable) {
            participantAvailableSlots.push(thirtyMinSlot);
          }
        }
      }
      const threshold = participants[participantId]?.threshold || 0;
      const existingMeetingsCount = schedules[participantId]?.[date]?.length || 0;
      const availableMeetingSlots = Math.max(0, threshold - existingMeetingsCount);
      if (availableMeetingSlots > 0) {
        participantsAvailableTimes[participantId] = participantAvailableSlots.slice(0, availableMeetingSlots);
      } else {
        participantsAvailableTimes[participantId] = [];
      }
    }
    const allTimeSlots = new Set<string>();
    for (const participantId of participantIds) {
      const slots = participantsAvailableTimes[participantId] || [];
      for (const slot of slots) {
        allTimeSlots.add(`${slot.start}-${slot.end}`);
      }
    }
    for (const timeSlotStr of allTimeSlots) {
      const [start, end] = timeSlotStr.split('-');
      const timeSlot: TimeSlot = { start, end };
      let allParticipantsAvailable = true;
      for (const participantId of participantIds) {
        const participantSlots = participantsAvailableTimes[participantId] || [];
        const isAvailable = participantSlots.some(slot => 
          slot.start === timeSlot.start && slot.end === timeSlot.end
        );
        if (!isAvailable) {
          allParticipantsAvailable = false;
          break;
        }
      }
      if (allParticipantsAvailable) {
        availableSlotsForDate.push(timeSlot);
      }
    }
    if (availableSlotsForDate.length > 0) {
      result[date] = availableSlotsForDate;
    }
  }
  return result;
}
