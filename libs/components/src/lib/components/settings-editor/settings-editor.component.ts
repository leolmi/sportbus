import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexModule } from '@angular/flex-layout';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { EditorBase } from '../editor.base';
import { Clipboard, ClipboardModule } from '@angular/cdk/clipboard';
import { CalendarItem, DayInfo, getWeekDays, Group, Person, SPORTBUS_USER_OPTIONS_FEATURE } from '@olmi/model';
import { MatExpansionModule } from '@angular/material/expansion';
import { keys as _keys, reduce as _reduce, remove as _remove, sortBy as _sortBy } from 'lodash';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { AppUserOptions, I18nDirective, I18nPipe, SPORTBUS_I18N } from '@olmi/common';
import { EssentialToolbarComponent } from '../essential-toolbar/essential-toolbar.component';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { PersonEditorComponent } from '../person-editor/person-editor.component';
import { DayEditorComponent } from '../day-editor/day-editor.component';
import { GroupEditorComponent } from '../group-editor/group-editor.component';
import { DayTimesPipe, PersonDetailsPipe, DayOfWeekPipe, IsWrongGroupPipe } from '../pipes';
import KEYS from '../../../../../../resources.keys';

interface PersonsGroup {
  persons: Person[];
  title: string;
}

@Component({
  selector: 'settings-editor',
  imports: [
    CommonModule,
    FlexModule,
    ClipboardModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatInputModule,
    MatExpansionModule,
    MatMenuModule,
    FormsModule,
    I18nDirective,
    PersonDetailsPipe,
    DayTimesPipe,
    EssentialToolbarComponent,
    I18nPipe,
    MatMenu,
    DayOfWeekPipe,
    IsWrongGroupPipe
  ],
  templateUrl: './settings-editor.component.html',
  styleUrl: './settings-editor.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsEditorComponent extends EditorBase {
  protected readonly KEYS = KEYS;
  private readonly _clipboard = inject(Clipboard);
  private readonly _i18n = inject(SPORTBUS_I18N);
  groupsCount$: Observable<string>;
  personsCount$: Observable<string>;
  calendarCount$: Observable<string>;
  calendarMap$: Observable<any>;
  clipboard$: BehaviorSubject<CalendarItem|undefined>;

  weekDays: DayInfo[];
  personsGroups$: Observable<PersonsGroup[]>;

  constructor() {
    super();

    this.clipboard$ = new BehaviorSubject<CalendarItem | undefined>(undefined);
    this.weekDays = getWeekDays((d) => this._i18n.localize(d));

    this.groupsCount$ = this.manager.session$.pipe(map(s =>
      ((s?.groups||[]).length>0) ? `${(s?.groups||[]).length||0}` : '' ));
    this.personsCount$ = this.manager.session$.pipe(map(s =>
      ((s?.persons||[]).length>0) ? `${(s?.persons||[]).length||0}` : '' ));
    this.calendarCount$ = this.manager.session$.pipe(map(s =>
      ((s?.calendar||[]).length>0) ? `${(s?.calendar||[]).length||0}` : '' ));
    this.calendarMap$ = this.manager.session$.pipe(map(s =>
      getCalendarMap(s?.calendar||[])));

    this.personsGroups$ = this.manager.session$.pipe(map(ses => {
      const grps: any = {
        drv: { title: KEYS._person_driver, persons: [] },
        mxd: { title: KEYS._person_mixed, persons: [] },
        psg: { title: KEYS._person_passenger, persons: [] }
      };
      (ses?.persons||[]).forEach(p => grps[personType(p)].persons.push(p));
      _keys(grps).forEach(gt => grps[gt].persons = _sortBy(grps[gt].persons, ['name']));
      return [grps.drv, grps.mxd, grps.psg];
    }))
  }

  private _updateCalendarItem(day: number, group: string, handler: (i: CalendarItem|undefined, list: CalendarItem[]) => boolean) {
    this.manager.updateSession(s => {
      let item = s.calendar.find(ci => ci.dayOfWeek === day && ci.group === group);
      return handler(item, s.calendar);
    });
  }

  back() {
    this.state.openSession(this.manager.session?.code||'');
  }

  addGroup() {
    this.manager.updateSession(s => {
      s.groups.push(new Group());
      return true;
    });
  }

  deleteGroup(grp: Group) {
    this._confirm.showYesNo(`Delete group "${grp.name}"?`, () =>
      this.manager.updateSession(s => {
        const removed = _remove(s.groups, g => g.code === grp.code);
        return removed.length > 0;
      }));
  }

  editGroup(data: Group) {
    this._dialog.open(GroupEditorComponent, { data });
  }

  addPerson() {
    this.manager.updateSession(s => {
      s.persons.push(new Person());
      return true;
    });
  }

  editPerson(data: Person) {
    this._dialog.open(PersonEditorComponent, { data });
  }

  deletePerson(prs: Person) {
    this._confirm.showYesNo(`Delete person "${prs.name}"?`, () =>
      this.manager.updateSession(s => {
        const removed = _remove(s.persons, p => p.code === prs.code);
        return removed.length > 0;
      }));
  }

  editDay(grp: Group, day: DayInfo) {
    let data = (this.manager.session?.calendar || []).find(ci => ci.dayOfWeek === day.num && ci.group === grp.code);
    if (!data) data = new CalendarItem({ dayOfWeek: day.num, group: grp.code });
    this._dialog.open(DayEditorComponent, { data });
  }
  copyDay(grp: Group, day: DayInfo) {
    const item = (this.manager.session?.calendar || []).find(ci => ci.dayOfWeek === day.num && ci.group === grp.code);
    this.clipboard$.next(item || undefined);
  }
  clearDay(grp: Group, day: DayInfo) {
    this._updateCalendarItem(day.num, grp.code, (i, list) => {
      if (i) {
        i.start = 0;
        i.end = 0;
        i.target = '';
      }
      return !!i;
    });
  }
  pasteDay(grp: Group, day: DayInfo) {
    this._updateCalendarItem(day.num, grp.code, (i, list) => {
      if (!i) {
        i = new CalendarItem({ dayOfWeek: day.num, group: grp.code });
        list.push(i);
      }
      const source = this.clipboard$.value;
      i.start = source?.start||0;
      i.end = source?.end||0;
      i.target = source?.target||'';
      return true;
    });
  }

  clearClipboard() {
    this.clipboard$.next(undefined);
  }

  deleteCalendarItem(index: number) {
    this.manager.updateSession((ses) => {
      ses.calendar.splice(index, 1);
      return true;
    });
  }
}

// const getTimes = (ts: string): Times|undefined => {
//   const times: string[] = [];
//   const words: string[] = [];
//   let m: any;
//   const rgx = /(\d{1,2}:\d{1,2})|(\w+)/gm;
//   while (!!(m = rgx.exec(ts))) {
//     if (m.index === rgx.lastIndex) rgx.lastIndex++;
//     if (m[1]) times.push(m[1]);
//     if (m[2]) words.push(m[2]);
//   }
//   const values = times.map(t => getTimeMlsValue(t));
//   values.sort();
//   if (values.length !== 2) return undefined;
//   return (<Times>{
//     start: values[0]||0,
//     end: values[1]||0,
//     target: words.join(' ')||''
//   });
// }

const getCalendarMap = (items: CalendarItem[]): any => {
  return _reduce(items, (m, i) => {
    return {
      ...m,
      [i.dayOfWeek]: {
        ...m[i.dayOfWeek],
        [i.group]: i // `${getTimeString(i.start)}  ${getTimeString(i.end)}  ${i.target}`
      }
    }
  }, <any>{});
}

const personType = (p: Person): string => p.isDriver ? (p.group ? 'mxd' : 'drv') : 'psg';
