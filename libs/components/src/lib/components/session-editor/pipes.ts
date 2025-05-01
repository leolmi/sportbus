import { Pipe, PipeTransform } from '@angular/core';
import { getTimeString, Session, Shuttle, ShuttleDirection } from '@olmi/model';



@Pipe({
  name: 'groupName',
  standalone: true
})
export class GroupNamePipe implements PipeTransform {
  transform(gcode: string, session: Session|undefined): string {
    return (session?.groups || []).find(g => g.code === gcode)?.name || gcode;
  }
}

@Pipe({
  name: 'personName',
  standalone: true
})
export class PersonNamePipe implements PipeTransform {
  transform(pcode: string, session: Session|undefined): string {
    return (session?.persons || []).find(p => p.code === pcode)?.name || pcode;
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

