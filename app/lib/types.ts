export interface Participant {
    name: string;
    threshold: number;
  }
  
  export interface TimeSlot {
    start: string;
    end: string;
  }
  
  export interface DailySchedule {
    [day: string]: TimeSlot[];
  }
  
  export interface ParticipantAvailability {
    [day: string]: TimeSlot[];
  }
  
  export interface Schedule {
    [date: string]: TimeSlot[];
  }
  
  export interface OverlappingSlot {
    date: string;
    slots: TimeSlot[];
  }