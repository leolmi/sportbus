import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorBase } from '../editor.base';
import {
  CalendarItem,
  Dictionary,
  getTimeString,
  PAGE_CODE,
  Person,
  Session,
  SessionOnDay,
  Shuttle, ShuttleDirection
} from '@olmi/model';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { chunk as _chunk, has as _has, keys as _keys, reduce as _reduce, sortBy } from 'lodash';
import { MatIconModule } from '@angular/material/icon';
import { FlexModule } from '@angular/flex-layout';
import { GroupNamePipe, ShuttleTypePipe } from './pipes';
import { ShuttleEditorComponent } from './shuttle-editor.component';
import { ShuttleErrorsComponent } from './shuttle-errors.component';

class CalendarItemWrapper {
  target: string = '';
  start: string = '';
  end: string = '';
  group: string = '';
}

@Component({
  selector: 'session-editor',
  imports: [
    CommonModule,
    FlexModule,
    MatIconModule,
    ShuttleTypePipe,
    ShuttleEditorComponent,
    ShuttleErrorsComponent,
    GroupNamePipe
  ],
  templateUrl: './session-editor.component.html',
  styleUrl: './session-editor.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionEditorComponent extends EditorBase {
  private _targetShuttle$: BehaviorSubject<Shuttle|undefined>;
  athletes$: Observable<Person[]>;
  athletesMap$: Observable<any>;
  calendar$: Observable<CalendarItemWrapper[]>;
  shuttles$: Observable<Shuttle[]>;
  menuPersons$: BehaviorSubject<Person[]>;

  UNKNOWN_ICON = 'question_mark';
  ICON_BY_CODE: any = {
    a: 'do_disturb',
    p: 'check'
  }

  constructor() {
    super();
    this._targetShuttle$ = new BehaviorSubject<Shuttle | undefined>(undefined);
    this.menuPersons$ = new BehaviorSubject<Person[]>([]);
    this.athletes$ = this.manager.session$.pipe(map(s =>
      sortBy((s?.persons||[]).filter(p => p.type === 'athlete'), ['name'])));

    this.calendar$ = combineLatest([this.manager.dayCalendarItems$, this.manager.session$])
      .pipe(map(([items, session]: [CalendarItem[], Session|undefined]) =>
        getCalendarItemsWrappers(items, session)));

    this.athletesMap$ = this.manager.sessionOnDay$.pipe(map(sod => getAthletesMap(sod)));

    this.shuttles$ = combineLatest([this.manager.sessionOnDay$, this.manager.session$, this.manager.dayCalendarItems$])
      .pipe(map(([sod, ses, items]: [SessionOnDay|undefined, Session|undefined, CalendarItem[]]) => {
        // defined shuttles
        const ds = sod?.shuttles||[];
        // calculated shuttles
        const cs = calcShuttles(ses, sod, items);
        return mergeShuttles(ds, cs);
      }))
  }

  goToConfiguration() {
    this.manager.setPage(PAGE_CODE.settings);
  }

  toggleAthlete(atl: Person) {
    this.manager.updateSessionOnDay((sod) => {
      sod.athletes = sod.athletes || {};
      if (!_has(sod.athletes, atl.code)) {
        sod.athletes[atl.code] = true;
      } else {
        const isp = !!(sod.athletes || {})[atl.code];
        if (isp) {
          sod.athletes[atl.code] = false;
        } else {
          delete sod.athletes[atl.code];
        }
      }
      return true;
    });
  }
}

const getAthletesMap = (sod: SessionOnDay|undefined): any => {
  return _reduce(sod?.athletes||{}, (m, p, n) => ({ ...m, [n]: p?'p':'a' }), <any>{});
}

const getCalendarItemsWrappers = (items: CalendarItem[], session: Session|undefined): CalendarItemWrapper[] => {
  return items.map(i => {
    const g = (session?.groups||[]).find(sg => sg.code === i.group);
    return <CalendarItemWrapper>{
      group: g?.name||'',
      start: getTimeString(i.start),
      end: getTimeString(i.end),
      target: i.target
    }
  })
}

const getShuttleCode = (time: number, direction: ShuttleDirection, target: string): string => `${direction}${time}@${target}`;

/**
 * calcola le navette necessarie in base al numero ed i gruppi degli atleti presenti
 * @param ses
 * @param sod
 * @param items
 */
const calcShuttles = (ses: Session|undefined, sod: SessionOnDay|undefined, items: CalendarItem[]): Partial<Shuttle>[] => {
  if (!ses || !sod) return [];

  // mappa delle navette necessarie di andata e ritorno sulla base solo dei tempi e target
  const shuttlesMap = _reduce(items, (m, i) => ({
    ...m,
    [getShuttleCode(i.start, 'A', i.target)]: <Partial<Shuttle>>{ time: i.start, direction: 'A', code: `A${i.start}`, target: i.target },
    [getShuttleCode(i.end, 'R', i.target)]: <Partial<Shuttle>>{ time: i.end, direction: 'R', code: `R${i.end}`, target: i.target  }
  }), <Dictionary<any>>{});
  // console.log('SHUTTLES MAP', shuttlesMap);

  // atleti effettivamente presenti
  const athletes = (ses?.persons||[]).filter(p => !!(<any>sod?.athletes||{})[p.code]);
  // console.log('ATHLETES', athletes);

  const defGroup = ses.groups[0];

  // mappa dei codici navetta per atleta
  // { codice: [atl1, ..., atlN] }
  const athletesMap = _reduce(athletes, (m, a) => {
    // item di calendario competente per l'atleta
    const item = items.find(i => i.group === (a.group||defGroup?.code||''));
    const codeA = getShuttleCode(item?.start||0, 'A', item?.target||'');
    const codeR = getShuttleCode(item?.end||0, 'R', item?.target||'');
    return {
      ...m,
      [codeA]: [ ...m[codeA]||[], a.code ],
      [codeR]: [ ...m[codeR]||[], a.code ],
    }
  }, <any>{});
  // console.log('ATHLETES MAP', athletesMap);

  const shuttles: Partial<Shuttle>[] = [];
  // sviluppo degli incastri navette sui tempi - navette sugli atleti
  _keys(athletesMap).forEach(code => {
    // numero di atleti che necessitano della tratta
    const achunks: string[][] = _chunk(athletesMap[code]||[], 4);
    achunks.forEach((c, i) => {
      const base = shuttlesMap[code];
      const shCode = `${code}-${i}`;
      let exsh = shuttles.find(s => s.code === shCode);
      if (!exsh) {
        exsh = <Partial<Shuttle>>{ ...base, code: shCode, _temporary: true };
        shuttles.push(exsh);
      }
      exsh.athletes = [];
    });
  });

  // elenco delle navette disponibili per ogni atleta e tratta
  // console.log('CALC SHUTTLES', shuttles);
  return shuttles;
}

const mergeShuttles = (ds: Shuttle[], cs: Partial<Shuttle>[]): Shuttle[] => {
  const dscodes = ds.map(s => s.code);
  const css = cs
    .filter(s => !dscodes.includes(s.code||''))
    .map(s => new Shuttle(s));
  return [...ds, ...css];
}
