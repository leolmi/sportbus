import { Person, Shuttle } from '@olmi/model';

export class SessionOnDayDto {
  readonly lu: number;
  readonly date: number;
  readonly session: string;
  readonly shuttles: Shuttle[];
  readonly athletes: any;
}
