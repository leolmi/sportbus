import { CalendarItem, Person } from '@olmi/model';

export class SessionDto {
  readonly _id: string;
  readonly lu: number;
  readonly code: string;
  readonly name: string;
  readonly description: string;
  readonly icon: string;
  readonly persons: Person[];
  readonly calendar: CalendarItem[];
}
