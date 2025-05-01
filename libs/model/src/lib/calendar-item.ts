/**
 * calendario predefinito giornaliero degli eventi
 */
export class CalendarItem {
  constructor(i?: Partial<CalendarItem>) {
    this.dayOfWeek = i?.dayOfWeek||0;
    this.start = i?.start||0;
    this.end = i?.end||0;
    this.target = i?.target||'';
    this.group = i?.group||'';
  }

  /**
   * day of week (0-6) (dom-sab)
   */
  dayOfWeek: number;
  /**
   * timespan di inizio
   */
  start: number;
  /**
   * timespan di fine
   */
  end: number;
  /**
   * target
   */
  target: string;
  /**
   * gruppo
   */
  group: string;
}
