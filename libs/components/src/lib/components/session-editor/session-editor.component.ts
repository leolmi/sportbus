import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorBase } from '../editor.base';
import { CalendarItem, Person, Session, SessionOnDay, Shuttle } from '@olmi/model';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { has as _has, sortBy as _sortBy } from 'lodash';
import { MatIconModule } from '@angular/material/icon';
import { FlexModule } from '@angular/flex-layout';
import { ActiveDirectionsPipe, GroupNamePipe, IsReadyDirectionPipe, ShuttleTypePipe } from '../pipes';
import { ShuttleEditorComponent } from '../shuttle-editor/shuttle-editor.component';
import { ShuttleErrorsComponent } from '../shuttle-errors/shuttle-errors.component';
import { calcShuttles, getPassengersMap, mergeShuttles } from '../shuttles-utilities';
import { DailyChatComponent } from '../daily-chat/daily-chat.component';
import { SessionHeaderComponent } from '../session-header/session-header.component';
import { SessionCalendarComponent } from '../session-calendar/session-calendar.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { I18nDirective } from '@olmi/common';
import KEYS from '../../../../../../resources.keys';


@Component({
  selector: 'session-editor',
  imports: [
    CommonModule,
    FlexModule,
    MatIconModule,
    MatTooltipModule,
    ShuttleTypePipe,
    ShuttleEditorComponent,
    ShuttleErrorsComponent,
    DailyChatComponent,
    GroupNamePipe,
    IsReadyDirectionPipe,
    ActiveDirectionsPipe,
    SessionHeaderComponent,
    SessionCalendarComponent,
    I18nDirective
  ],
  templateUrl: './session-editor.component.html',
  styleUrl: './session-editor.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionEditorComponent extends EditorBase {
  private _targetShuttle$: BehaviorSubject<Shuttle|undefined>;
  passengers$: Observable<Person[]>;
  passengersMap$: Observable<any>;

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
    this.passengers$ = this.manager.session$.pipe(map(s =>
      _sortBy((s?.persons||[]).filter(p => !p.isDriver||!!p.group), ['name'])));

    this.passengersMap$ = this.manager.sessionOnDay$.pipe(map(sod => getPassengersMap(sod)));

    this.shuttles$ = combineLatest([this.manager.sessionOnDay$, this.manager.session$, this.manager.dayCalendarItems$])
      .pipe(map(([sod, ses, items]: [SessionOnDay|undefined, Session|undefined, CalendarItem[]]) => {
        // calculated shuttles
        const cs = calcShuttles(ses, sod, items);
        return mergeShuttles(sod?.shuttles||[], cs);
      }));

    this.shuttlesLayout$ = this.state.layout$.pipe(map(l => l.compact ? 'column' : 'row'));
  }

  goToConfiguration() {
    this.state.openSettingsEditor(this.manager.session?.code||'');
  }

  togglePassenger(prs: Person) {
    this.manager.updateSessionOnDay((sod) => {
      sod.passengersMap = sod.passengersMap || {};
      if (!_has(sod.passengersMap, prs.code)) {
        sod.passengersMap[prs.code] = true;
      } else {
        const isp = !!(sod.passengersMap || {})[prs.code];
        if (isp) {
          sod.passengersMap[prs.code] = false;
        } else {
          delete sod.passengersMap[prs.code];
        }
      }
      return true;
    });
  }

  addPassenger() {

  }

  protected readonly KEYS = KEYS;
}


