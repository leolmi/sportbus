import { Person, Shuttle } from '@olmi/model';
import { Document } from 'mongoose';

export interface SessionOnDayDoc extends Document {
  readonly lu: number;
  readonly date: number;
  readonly session: string;
  readonly shuttles: Shuttle[];
  readonly persons: Person[];
  readonly passengersMap: any;
}
