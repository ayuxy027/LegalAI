// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export interface Case {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scheduledDate: any;
  id: string;
  title: string;
  court: string;
  nextHearing: string;
  status: 'upcoming' | 'completed' | 'pending';
  documents: string[];
  notes: string;
}

export interface Reminder {
  id: string;
  title: string;
  date: string;
  time: string;
  priority: 'high' | 'medium' | 'low';
}

export interface Event extends Reminder {
  type: 'hearing' | 'meeting' | 'deadline' | 'appointment' | 'reminder';
}