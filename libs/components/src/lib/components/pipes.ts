import { Pipe, PipeTransform } from '@angular/core';
import { getTimeString, Person, Session, SessionOnDay, Shuttle, ShuttleDirection } from '@olmi/model';
import { keys as _keys, isNumber as _isNumber } from 'lodash';
import { getGroupName, getPersonName } from './shuttles-utilities';


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
  name: 'isReadyDirection',
  standalone: true
})
export class IsReadyDirectionPipe implements PipeTransform {
  transform(sod: SessionOnDay|undefined|null, direction: ShuttleDirection): boolean {
    const athletes_map = sod?.athletes || {};
    const eff_athletes = _keys(athletes_map).filter(a => athletes_map[a]);
    const shuttles = (sod?.shuttles || []).filter(s => s.direction === direction);
    const missingAthlete = eff_athletes.find(a => !shuttles.find(s => s.athletes.includes(a)));
    const missingDriver = shuttles.find(s => !s.driver);
    return !missingAthlete && !missingDriver;
  }
}

@Pipe({
  name: 'activeDirections',
  standalone: true
})
export class ActiveDirectionsPipe implements PipeTransform {
  transform(sod: SessionOnDay|undefined|null, atl: Person): string {
    const ashs = (sod?.shuttles||[]).filter(sh => sh.athletes.includes(atl.code));
    const hasA = !!ashs.find(sh => sh.direction==='A');
    const hasR = !!ashs.find(sh => sh.direction==='R');
    return `${hasA?'A':''}${hasR?'R':''}`;
  }
}


@Pipe({
  name: 'athleteTime',
  standalone: true
})
export class AthleteTimePipe implements PipeTransform {
  transform(acode: string, shuttle: Shuttle): string {
    const time = (shuttle?.athletesTimesMap||{})[acode];
    return _isNumber(time) ? getTimeString(time) : '';
  }
}

