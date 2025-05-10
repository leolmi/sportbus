import { Pipe, PipeTransform } from '@angular/core';
import { CalendarItem, getTimeString, Person, Session } from '@olmi/model';
import { getGroupName } from '../shuttles-utilities';

@Pipe({
  name: 'personDetails',
  standalone: true
})
export class PersonDetailsPipe implements PipeTransform {

  transform(prs: Person, session: Session|undefined): string {
    return prs.isDriver ?
      (prs.group ? `driver & passenger of ${getGroupName(session, prs.group)}` : 'driver') :
      (prs.group ? `passenger of ${getGroupName(session, prs.group)}` : 'simple passenger');
  }
}


@Pipe({
  name: 'dayTimes',
  standalone: true
})
export class DayTimesPipe implements PipeTransform {
  transform(item: CalendarItem): string {
    return (item.start && item.end) ? `${getTimeString(item.start)} - ${getTimeString(item.end)}` : '';
  }
}
