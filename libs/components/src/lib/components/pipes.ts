import { Pipe, PipeTransform } from '@angular/core';
import { getTimeString, Person, Session, SessionOnDay, Shuttle, ShuttleDirection } from '@olmi/model';
import { keys as _keys, isNumber as _isNumber } from 'lodash';
import { getGroupName, getPersonName, getPersonIcon } from './shuttles-utilities';
import { formatDate } from '@angular/common';


@Pipe({
  name: 'groupName',
  standalone: true
})
export class GroupNamePipe implements PipeTransform {
  transform(gcode: string, session: Session|undefined): string {
    return getGroupName(session, gcode);
  }
}

@Pipe({
  name: 'personName',
  standalone: true
})
export class PersonNamePipe implements PipeTransform {
  transform(pcode: string, session: Session|undefined): string {
    return getPersonName(session, pcode);
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
  name: 'isReadyDirection',
  standalone: true
})
export class IsReadyDirectionPipe implements PipeTransform {
  transform(sod: SessionOnDay|undefined|null, direction: ShuttleDirection): boolean {
    const passengers_map = sod?.passengersMap || {};
    const eff_passengers = _keys(passengers_map).filter(a => passengers_map[a]);
    const shuttles = (sod?.shuttles || []).filter(s => s.direction === direction);
    const firstMissingPassenger = eff_passengers.find(a => !shuttles.find(s => s.passengers.includes(a)));
    const firstMissingDriver = shuttles.find(s => !s.driver);
    return !firstMissingPassenger && !firstMissingDriver;
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

