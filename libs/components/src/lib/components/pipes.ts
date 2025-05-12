import { inject, Pipe, PipeTransform } from '@angular/core';
import {
  CalendarItem,
  DAY,
  getTimeString, isEmptyString, isToday,
  Person,
  Session, SessionContext,
  SessionOnDay,
  Shuttle,
  ShuttleDirection, SPORTBUS_USER_OPTIONS_FEATURE
} from '@olmi/model';
import { keys as _keys, isNumber as _isNumber } from 'lodash';
import { getGroupName, getPersonName, getPersonIcon, isReadyOnDirection } from './shuttles-utilities';
import { formatDate } from '@angular/common';
import { AppUserOptions, SessionManager, SPORTBUS_I18N } from '@olmi/common';
import { BehaviorSubject } from 'rxjs';

@Pipe({
  name: 'personDetails',
  standalone: true
})
export class PersonDetailsPipe implements PipeTransform {

  transform(prs: Person, context: SessionContext): string {
    return prs.isDriver ?
      (prs.group ? `driver & passenger of ${getGroupName(context, prs.group)}` : 'driver') :
      (prs.group ? `passenger of ${getGroupName(context, prs.group)}` : 'simple passenger');
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

@Pipe({
  name: 'groupName',
  standalone: true
})
export class GroupNamePipe implements PipeTransform {
  transform(gcode: string, context: SessionContext): string {
    return getGroupName(context, gcode);
  }
}

@Pipe({
  name: 'personName',
  standalone: true
})
export class PersonNamePipe implements PipeTransform {
  transform(pcode: string, context: SessionContext): string {
    return getPersonName(context, pcode);
  }
}

@Pipe({
  name: 'personIcon',
  standalone: true
})
export class PersonIconPipe implements PipeTransform {
  transform(p: Person): string {
    return getPersonIcon(p);
  }
}

@Pipe({
  name: 'shuttleType',
  standalone: true
})
export class ShuttleTypePipe implements PipeTransform {
  transform(shuttles: Shuttle[]|null|undefined, direction: ShuttleDirection = 'A'): Shuttle[] {
    return (shuttles||[]).filter(s => s.direction === direction);
  }
}

@Pipe({
  name: 'timeToString',
  standalone: true
})
export class TimeToStringPipe implements PipeTransform {
  transform(time: number): string {
    return getTimeString(time);
  }
}

@Pipe({
  name: 'dateFormat',
  standalone: true
})
export class DateFormatPipe implements PipeTransform {
  transform(date: number, format: string): string {
    return formatDate(date, format, 'en-EN');
  }
}

@Pipe({
  name: 'dayOfWeek',
  standalone: true
})
export class DayOfWeekPipe implements PipeTransform {
  i18n = inject(SPORTBUS_I18N);
  transform(day: number): string {
    return this.i18n.localize(DAY[day]);
  }
}

@Pipe({
  name: 'isReadyDirection',
  standalone: true
})
export class IsReadyDirectionPipe implements PipeTransform {
  transform(sod: SessionOnDay|undefined|null, direction: ShuttleDirection): boolean {
    return isReadyOnDirection(sod||undefined, direction);
  }
}

@Pipe({
  name: 'activeDirections',
  standalone: true
})
export class ActiveDirectionsPipe implements PipeTransform {
  transform(sod: SessionOnDay|undefined|null, atl: Person): string {
    const ashs = (sod?.shuttles||[]).filter(sh => sh.passengers.includes(atl.code));
    const hasA = !!ashs.find(sh => sh.direction==='A');
    const hasR = !!ashs.find(sh => sh.direction==='R');
    return `${hasA?'A':''}${hasR?'R':''}`;
  }
}


@Pipe({
  name: 'passengerTime',
  standalone: true
})
export class PassengerTimePipe implements PipeTransform {
  transform(acode: string, shuttle: Shuttle): string {
    const time = (shuttle?.passengersTimesMap||{})[acode];
    return _isNumber(time) ? getTimeString(time) : '';
  }
}

/**
 * valuta che l'utente sia temporaneo (presente solo sul on-day) e
 * non inserito in alcuna navetta
 */
@Pipe({
  name: 'isSodNotUsedPassenger',
  standalone: true
})
export class IsSodNotUsedPassengerPipe implements PipeTransform {
  transform(prs: Person, context: SessionContext): boolean {
    const isSodUser = !!(context.sod?.persons||[]).find(p => p.code === prs.code);
    const isInShuttle = !!(context.sod?.shuttles||[]).find(s =>
      s.passengers.includes(prs.code) || s.driver === prs.code);
    return isSodUser && !isInShuttle;
  }
}

@Pipe({
  name: 'isSodCalendarItem',
  standalone: true
})
export class IsSodCalendarItemPipe implements PipeTransform {
  transform(ci: CalendarItem, context: SessionContext): boolean {
    return !!(context.sod?.calendar||[]).find(i => i.code === ci.code);
  }
}

/**
 * rileva i gruppi non più esistenti
 */
@Pipe({
  name: 'isWrongGroup',
  standalone: true
})
export class IsWrongGroupPipe implements PipeTransform {
  transform(gcode: string, context: SessionContext): boolean {
    return !(context.ses?.groups||[]).find(g => g.code === gcode);
  }
}


/**
 * mostra data e ora del messaggio
 */
@Pipe({
  name: 'messageDateTime',
  standalone: true
})
export class MessageDateTimePipe implements PipeTransform {
  transform(date: number): string {
    const d = new Date(date);
    return isToday(d) ? d.toLocaleTimeString() : d.toLocaleString();
  }
}

/**
 * mostra l'owner del messaggio
 */
@Pipe({
  name: 'messageOwner',
  standalone: true
})
export class MessageOwnerPipe implements PipeTransform {
  transform(owner: string): string {
    return owner;
  }
}

/**
 * vero se la stringa è vuota
 */
@Pipe({
  name: 'isEmptyString',
  standalone: true
})
export class IsEmptyStringPipe implements PipeTransform {
  transform(v: string|null|undefined): boolean {
    return isEmptyString(v);
  }
}

/**
 * vero se l'utente corrisponde
 */
@Pipe({
  name: 'iAm',
  standalone: true
})
export class IAmPipe implements PipeTransform {
  transform(name: string|null|undefined): boolean {
    const o = AppUserOptions.getFeatures<any>(SPORTBUS_USER_OPTIONS_FEATURE);
    return !!name && (name||'') === (o.userName||'');
  }
}
