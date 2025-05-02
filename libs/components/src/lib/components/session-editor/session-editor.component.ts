import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorBase } from '../editor.base';
import { CalendarItem, PAGE_CODE, Person, Session, SessionOnDay, Shuttle } from '@olmi/model';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { has as _has, sortBy as _sortBy } from 'lodash';
import { MatIconModule } from '@angular/material/icon';
import { FlexModule } from '@angular/flex-layout';
import { ActiveDirectionsPipe, GroupNamePipe, IsReadyDirectionPipe, ShuttleTypePipe } from '../pipes';
import { ShuttleEditorComponent } from '../shuttle-editor/shuttle-editor.component';
import { ShuttleErrorsComponent } from '../shuttle-errors/shuttle-errors.component';
import {
  calcShuttles,
  CalendarItemWrapper,
  getAthletesMap,
  getCalendarItemsWrappers,
  mergeShuttles
} from '../shuttles-utilities';
import { DailyChatComponent } from '../daily-chat/daily-chat.component';


@Component({
  selector: 'session-editor',
  imports: [
    CommonModule,
    FlexModule,
    MatIconModule,
    ShuttleTypePipe,
    ShuttleEditorComponent,
    ShuttleErrorsComponent,
    DailyChatComponent,
    GroupNamePipe,
    IsReadyDirectionPipe,
    ActiveDirectionsPipe,
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
  shuttlesLayout$: Observable<string>;

  UNKNOWN_ICON = 'question_mark';
  ICON_BY_CODE: any = {
    a: 'do_disturb',
    p: 'check'
  }
  ICON_BY_DIRECTIONS: any = {
    A: 'east',
    R: 'west',
    AR: 'sync_alt'
  }

  constructor() {
    super();
    this._targetShuttle$ = new BehaviorSubject<Shuttle | undefined>(undefined);
    this.menuPersons$ = new BehaviorSubject<Person[]>([]);
    this.athletes$ = this.manager.session$.pipe(map(s =>
      _sortBy((s?.persons||[]).filter(p => p.type === 'athlete'), ['name'])));

    this.calendar$ = combineLatest([this.manager.dayCalendarItems$, this.manager.session$])
      .pipe(map(([items, session]: [CalendarItem[], Session|undefined]) =>
        getCalendarItemsWrappers(items, session)));

    this.athletesMap$ = this.manager.sessionOnDay$.pipe(map(sod => getAthletesMap(sod)));

    this.shuttles$ = combineLatest([this.manager.sessionOnDay$, this.manager.session$, this.manager.dayCalendarItems$])
      .pipe(map(([sod, ses, items]: [SessionOnDay|undefined, Session|undefined, CalendarItem[]]) => {
        // calculated shuttles
        const cs = calcShuttles(ses, sod, items);
        return mergeShuttles(sod?.shuttles||[], cs);
      }));

    this.shuttlesLayout$ = this.state.layout$.pipe(map(l => l.compact ? 'column' : 'row'));
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


